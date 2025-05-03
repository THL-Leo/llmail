import { NextResponse } from 'next/server';
import { validateEnv } from '@/utils/env';

/**
 * API route to validate environment variables
 * This is for development purposes only and should be removed in production
 */
export async function GET() {
  const { valid, missing } = validateEnv();
  
  return NextResponse.json({
    success: valid,
    missingEnvVars: missing,
    message: valid 
      ? 'All required environment variables are set' 
      : 'Some required environment variables are missing',
  });
}