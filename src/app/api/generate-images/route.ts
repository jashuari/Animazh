import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import os from 'os';

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

// Function to get the appropriate upload directory
function getUploadDir() {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the temp directory
    return join(os.tmpdir(), 'uploads');
  }
  // In development, use the local uploads directory
  return join(process.cwd(), 'uploads');
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
    
    // Get the appropriate upload directory
    const baseUploadDir = getUploadDir();
    const uploadDir = join(baseUploadDir, sessionId);

    try {
      // Ensure the base upload directory exists
      if (!existsSync(baseUploadDir)) {
        await mkdir(baseUploadDir, { recursive: true });
      }
      // Create session-specific directory
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating directories:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create upload directory' },
        { status: 500 }
      );
    }

    const metadataPath = join(uploadDir, 'metadata.json');
    let metadata;

    // Initialize or load metadata
    if (chunkIndex === 0) {
      metadata = {
        name,
        email,
        styleStrength,
        watermark,
        totalImages,
        totalChunks,
        processedChunks: [],
        timestamp: new Date().toISOString(),
        sessionId,
      };
    } else {
      try {
        metadata = JSON.parse(await readFile(metadataPath, 'utf-8'));
      } catch (error) {
        // If metadata doesn't exist for a non-first chunk, something went wrong
        return NextResponse.json(
          { success: false, error: 'Upload session not found' },
          { status: 400 }
        );
      }
    }

    // Process images in this chunk
    const chunkImages = [];
    let imageIndex = chunkIndex * 2; // Since we're using chunks of 2
    while (formData.has(`image${imageIndex}`)) {
      const image = formData.get(`image${imageIndex}`) as File;
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `image-${imageIndex}.${image.name.split('.').pop()}`;
      await writeFile(join(uploadDir, filename), buffer);
      chunkImages.push(filename);
      imageIndex++;
    }

    // Update metadata
    if (!metadata.processedChunks.includes(chunkIndex)) {
      metadata.processedChunks.push(chunkIndex);
      metadata.processedChunks.sort((a: number, b: number) => a - b);
    }
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // If this is the last chunk, trigger the image processing
    if (chunkIndex === totalChunks - 1 && metadata.processedChunks.length === totalChunks) {
      // Here you would trigger your image processing pipeline
      // For now, we'll just return success
      return NextResponse.json({
        success: true,
        message: 'All chunks received successfully',
        sessionId,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIndex + 1} of ${totalChunks} received`,
      sessionId,
      processedChunks: metadata.processedChunks,
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