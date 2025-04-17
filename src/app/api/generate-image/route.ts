import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import formidable, { Fields, Files } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { Readable } from 'node:stream';
import { IncomingMessage } from 'node:http';

// Disable body parsing since we're using formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Validation schemas
const emailSchema = z.string().email();
const nameSchema = z.string().regex(/^[a-zA-Z0-9\s.,'-]+$/);

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'private');

// Helper function to ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Helper function to validate file
function validateFile(file: formidable.File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype || '')) {
    return 'Invalid file type. Only JPEG and PNG files are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit.';
  }
  return null;
}

// Helper function to convert NextRequest to IncomingMessage
function convertNextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
  const nodeStream = new Readable({
    read() {
      // This is intentionally empty as we'll push data manually
    }
  });

  // Copy over the necessary properties
  Object.assign(nodeStream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });

  // Push the request body and end the stream
  req.body?.pipeTo(new WritableStream({
    write(chunk) {
      nodeStream.push(chunk);
    },
    close() {
      nodeStream.push(null);
    }
  }));

  return nodeStream as unknown as IncomingMessage;
}

export async function POST(req: NextRequest) {
  console.log('Received upload request');
  
  try {
    // Ensure upload directory exists
    await ensureUploadDir();
    console.log('Upload directory ensured');

    // Parse form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      uploadDir: UPLOADS_DIR,
      filename: (_name: string, ext: string) => `${uuidv4()}${ext}`,
    });

    console.log('Formidable instance created');
    const nodeReq = convertNextRequestToIncomingMessage(req);
    console.log('Request converted to IncomingMessage');

    return new Promise((resolve, reject) => {
      form.parse(nodeReq, async (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
          console.error('Error parsing form:', err);
          resolve(NextResponse.json(
            { error: 'Error processing upload: ' + err.message },
            { status: 500 }
          ));
          return;
        }

        try {
          console.log('Form parsed successfully', { fields: Object.keys(fields), files: Object.keys(files) });
          
          // Validate name and email
          const name = fields.name?.[0];
          const email = fields.email?.[0];

          if (!name || !email) {
            console.log('Missing required fields', { name: !!name, email: !!email });
            resolve(NextResponse.json(
              { error: 'Name and email are required' },
              { status: 400 }
            ));
            return;
          }

          try {
            nameSchema.parse(name);
            emailSchema.parse(email);
            console.log('Name and email validation passed');
          } catch (validationError) {
            console.error('Validation error:', validationError);
            resolve(NextResponse.json(
              { error: 'Invalid name or email format' },
              { status: 400 }
            ));
            return;
          }

          // Validate file
          const file = files.image?.[0];
          if (!file) {
            console.log('No image file provided');
            resolve(NextResponse.json(
              { error: 'No image file provided' },
              { status: 400 }
            ));
            return;
          }

          const fileError = validateFile(file);
          if (fileError) {
            console.log('File validation failed:', fileError);
            resolve(NextResponse.json(
              { error: fileError },
              { status: 400 }
            ));
            return;
          }

          console.log('File validation passed');

          // Get the filename without extension
          const fileBaseName = path.basename(file.filepath, path.extname(file.filepath));
          
          // Create response data
          const responseData = {
            success: true,
            message: 'File uploaded successfully',
            filename: path.basename(file.filepath),
            name,
            email,
            timestamp: new Date().toISOString(),
            styleStrength: fields.styleStrength?.[0] || 'standard',
            watermark: fields.watermark?.[0] === 'true'
          };

          // Save response data to a text file with the same UUID
          const responseFilePath = path.join(UPLOADS_DIR, `${fileBaseName}.txt`);
          await fs.writeFile(responseFilePath, JSON.stringify(responseData, null, 2));

          // Success response
          resolve(NextResponse.json(responseData));
          console.log('Success response sent');
        } catch (error) {
          console.error('Error processing request:', error);
          resolve(NextResponse.json(
            { error: 'Server error processing request' },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 