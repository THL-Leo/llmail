import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * API route to test Supabase connection
 * This is for development purposes only and should be removed in production
 */
export async function GET() {
  try {
    // Test the connection by fetching the current timestamp
    const { data, error } = await supabase.from('_test').select('*').limit(1).single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 means the table doesn't exist, which is expected
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: error.message,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
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