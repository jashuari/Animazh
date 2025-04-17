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
const API_KEY = process.env.API_KEY || 'your-default-api-key'; // Replace with your actual API key

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
  try {
    // Validate API key
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Parse form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      uploadDir: UPLOADS_DIR,
      filename: (_name: string, ext: string) => `${uuidv4()}${ext}`,
    });

    const nodeReq = convertNextRequestToIncomingMessage(req);

    return new Promise((resolve, reject) => {
      form.parse(nodeReq, async (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
          resolve(NextResponse.json(
            { error: 'Error processing upload' },
            { status: 500 }
          ));
          return;
        }

        try {
          // Validate name and email
          const name = fields.name?.[0];
          const email = fields.email?.[0];

          if (!name || !email) {
            resolve(NextResponse.json(
              { error: 'Name and email are required' },
              { status: 400 }
            ));
            return;
          }

          try {
            nameSchema.parse(name);
            emailSchema.parse(email);
          } catch (validationError) {
            resolve(NextResponse.json(
              { error: 'Invalid name or email format' },
              { status: 400 }
            ));
            return;
          }

          // Validate file
          const file = files.image?.[0];
          if (!file) {
            resolve(NextResponse.json(
              { error: 'No image file provided' },
              { status: 400 }
            ));
            return;
          }

          const fileError = validateFile(file);
          if (fileError) {
            resolve(NextResponse.json(
              { error: fileError },
              { status: 400 }
            ));
            return;
          }

          // Success response
          resolve(NextResponse.json({
            success: true,
            message: 'File uploaded successfully',
            filename: path.basename(file.filepath),
            name,
            email,
          }));
        } catch (error) {
          resolve(NextResponse.json(
            { error: 'Server error processing request' },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 