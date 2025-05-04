import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API route to execute custom SQL statements
 * This should be secured in production environments
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const { sql } = await request.json();
    
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({
        success: false,
        message: 'Invalid SQL statement',
      }, { status: 400 });
    }
    
    // Initialize Supabase with service role key for direct SQL execution
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        message: 'Missing Supabase credentials',
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    
    // For Supabase, we recommend using the built-in SQL editor instead
    // This endpoint is primarily for testing and initial setup
    
    // Response message
    return NextResponse.json({
      success: true,
      message: 'SQL Execution Notice',
      details: {
        notice: 'For security and compatibility reasons, SQL execution via this API is limited. Please use the Supabase SQL Editor directly for complex operations.',
        recommendedAction: 'Copy the SQL from the UI and paste it into the Supabase SQL Editor'
      },
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
    });
    
  } catch (error) {
    console.error('Error executing SQL:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}