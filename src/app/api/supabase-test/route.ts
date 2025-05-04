import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * API route to test Supabase connection
 * This is for development purposes only and should be removed in production
 */
export async function GET() {
  try {
    // Simply use the auth API to check Supabase is responding
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: error.message,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      authenticated: data.session !== null,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}