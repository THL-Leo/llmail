import { NextResponse } from 'next/server';

/**
 * API route to directly test Supabase connection without using the client
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        message: 'Supabase credentials are missing',
      }, { status: 500 });
    }
    
    // Test the connection directly using fetch
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    
    const text = await res.text();
    
    return NextResponse.json({
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      url: `${supabaseUrl}/rest/v1/`,
      text: text.substring(0, 200), // Limit response text
      headers: {
        'Content-Type': res.headers.get('Content-Type'),
        'Server': res.headers.get('Server'),
      },
      env: {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl.substring(0, 10) + '...',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey.substring(0, 10) + '...',
      }
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