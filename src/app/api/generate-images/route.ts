import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${token}`,
  });
  
  const data = await response.json();
  return data.success;
}

async function uploadToCloudinary(file: File, sessionId: string): Promise<string> {
  try {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `animazh/${sessionId}`,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const recaptchaToken = formData.get('recaptchaToken') as string;
    
    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const styleStrength = formData.get('styleStrength') as string;
    const watermark = formData.get('watermark') === 'true';
    const chunkIndex = parseInt(formData.get('chunkIndex') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const totalImages = parseInt(formData.get('totalImages') as string);
    const sessionId = formData.get('sessionId') as string || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Process images in this chunk
    const uploadedUrls = [];
    let imageIndex = chunkIndex * 2; // Since we're using chunks of 2
    
    while (formData.has(`image${imageIndex}`)) {
      const image = formData.get(`image${imageIndex}`) as File;
      try {
        const imageUrl = await uploadToCloudinary(image, sessionId);
        uploadedUrls.push({
          index: imageIndex,
          url: imageUrl
        });
      } catch (error) {
        console.error(`Error uploading image ${imageIndex}:`, error);
        return NextResponse.json(
          { success: false, error: `Failed to upload image ${imageIndex}` },
          { status: 500 }
        );
      }
      imageIndex++;
    }

    // Store metadata in Cloudinary as a JSON file if this is the first chunk
    if (chunkIndex === 0) {
      const metadata = {
        name,
        email,
        styleStrength,
        watermark,
        totalImages,
        totalChunks,
        timestamp: new Date().toISOString(),
        sessionId,
      };

      try {
        await cloudinary.uploader.upload(`data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`, {
          folder: `animazh/${sessionId}`,
          public_id: 'metadata',
          resource_type: 'raw'
        });
      } catch (error) {
        console.error('Error uploading metadata:', error);
        // Continue even if metadata upload fails
      }
    }

    // If this is the last chunk, we can trigger the image processing
    if (chunkIndex === totalChunks - 1) {
      return NextResponse.json({
        success: true,
        message: 'All chunks received successfully',
        sessionId,
        uploadedUrls
      });
    }

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1} of ${totalChunks} received`,
      sessionId,
      uploadedUrls
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload' },
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