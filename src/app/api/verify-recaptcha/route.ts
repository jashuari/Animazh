import { NextResponse } from 'next/server';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const verificationResponse = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          errors: verificationResult['error-codes'] 
        },
        { status: 400 }
      );
    }

    // Check the score - 0.5 is a common threshold
    if (verificationResult.score < 0.5) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'reCAPTCHA score too low',
          score: verificationResult.score 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      score: verificationResult.score,
      action: verificationResult.action,
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 