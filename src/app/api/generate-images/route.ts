import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase';

async function verifyRecaptcha(token: string): Promise<boolean> {
  // Skip reCAPTCHA verification in development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

async function saveImageToDatabase(
  file: File,
  sessionId: string,
  groupId: string,
  imageIndex: number,
  name: string,
  email: string,
  styleStrength: number,
  watermark: boolean,
  totalImages: number
): Promise<void> {
  try {
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Insert new record for each image
    console.log(`Inserting record for image ${imageIndex + 1} of ${totalImages}`);
    const { error: dbError } = await supabaseAdmin
      .from('images')
      .insert({
        session_id: sessionId,
        group_id: groupId,
        name,
        email,
        style_strength: styleStrength,
        watermark,
        total_images: totalImages,
        image_index: imageIndex,
        status: 'processing',
        image_data: buffer,
        file_size: file.size,
        mime_type: file.type,
        metadata: {
          uploadStarted: new Date().toISOString(),
          fileName: file.name,
          originalIndex: imageIndex
        }
      });

    if (dbError) {
      console.error('Error saving image to database:', dbError);
      throw new Error(`Failed to save image: ${dbError.message}`);
    }

    console.log(`Image ${imageIndex + 1} saved successfully to database`);
  } catch (error) {
    console.error('Error in saveImageToDatabase:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
    throw new Error('Failed to save image: Unknown error');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Detailed debug logging
    console.log('Received form data keys:', Array.from(formData.keys()));
    console.log('Form data values:', {
      name: formData.get('name'),
      email: formData.get('email'),
      styleStrength: formData.get('styleStrength'),
      watermark: formData.get('watermark'),
      totalImages: formData.get('totalImages')
    });
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const styleStrength = parseInt(formData.get('styleStrength') as string) || 50;
    const watermark = formData.get('watermark') === 'true';
    const totalImages = parseInt(formData.get('totalImages') as string);
    const sessionId = formData.get('sessionId') as string || crypto.randomUUID();
    const groupId = formData.get('groupId') as string || crypto.randomUUID();
    const recaptchaToken = formData.get('recaptchaToken') as string;

    // Verify reCAPTCHA token (will be skipped in development)
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json({ error: 'Invalid reCAPTCHA token' }, { status: 400 });
    }

    // Validate required fields
    if (!name || !email || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!totalImages || totalImages <= 0) {
      return NextResponse.json({ error: 'Invalid totalImages value' }, { status: 400 });
    }

    // Process each image
    const uploadedFiles = [];
    const errors = [];

    // Find all image files in formData
    const imageFiles = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('image'))
      .map(([key, value]) => ({ key, value }));

    console.log(`Found ${imageFiles.length} image files to process`);

    for (const { key, value } of imageFiles) {
      if (!value || !(value instanceof File)) {
        errors.push(`Invalid or missing file for ${key}`);
        continue;
      }

      try {
        const imageIndex = parseInt(key.replace('image', ''));
        
        // Log file details
        console.log(`Processing file ${imageIndex + 1}:`, {
          key,
          name: value.name,
          type: value.type,
          size: value.size
        });

        // Save the image data to the database
        await saveImageToDatabase(
          value,
          sessionId,
          groupId,
          imageIndex,
          name,
          email,
          styleStrength,
          watermark,
          totalImages
        );

        uploadedFiles.push({
          name: value.name,
          index: imageIndex
        });
      } catch (error) {
        console.error(`Error processing ${key}:`, error);
        errors.push(`Failed to process ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update metadata for the group once all files are processed
    if (uploadedFiles.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('images')
        .update({
          metadata: {
            uploadCompleted: new Date().toISOString(),
            totalUploaded: uploadedFiles.length
          }
        })
        .eq('group_id', groupId);

      if (updateError) {
        console.error('Error updating group metadata:', updateError);
        errors.push(`Failed to update group metadata: ${updateError.message}`);
      }
    }

    // Return response with status of all uploads
    return NextResponse.json({
      success: errors.length === 0 && uploadedFiles.length === totalImages,
      groupId,
      sessionId,
      uploadedFiles,
      totalProcessed: uploadedFiles.length,
      expectedTotal: totalImages,
      errors: errors.length > 0 ? errors : undefined,
      message: `Uploaded ${uploadedFiles.length} of ${totalImages} images successfully`
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// Increase payload size limit for the API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}; 