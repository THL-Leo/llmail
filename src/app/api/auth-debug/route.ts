import { NextResponse } from 'next/server';

/**
 * API route to debug auth configuration
 * This is for development purposes only and should be removed in production
 */
export async function GET() {
  try {
    // Get the auth configuration details (without exposing secrets)
    const config = {
      nextauth_url: process.env.NEXTAUTH_URL || 'Not set',
      google_client_id: process.env.GOOGLE_CLIENT_ID 
        ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` 
        : 'Not set',
      google_client_secret: process.env.GOOGLE_CLIENT_SECRET 
        ? 'Set (first few chars masked)' 
        : 'Not set',
      nextauth_secret: process.env.NEXTAUTH_SECRET 
        ? 'Set (masked)' 
        : 'Not set',
      callback_url: `${process.env.NEXTAUTH_URL}/api/auth/callback/google` || 'Unknown',
      expected_redirect_uri: 'http://localhost:3000/api/auth/callback/google',
    };
    
    return NextResponse.json({
      success: true,
      config,
      environment: process.env.NODE_ENV,
      tips: [
        "Ensure NEXTAUTH_URL is set to http://localhost:3000",
        "Check Google OAuth has the correct callback: http://localhost:3000/api/auth/callback/google",
        "Verify NEXTAUTH_SECRET is a strong random string",
        "Try removing https://mail.google.com/ from the scopes if you're just testing authentication",
        "Enable 'debug: true' in your NextAuth configuration"
      ],
    });
  } catch (error) {
    console.error('Error in auth debug endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}