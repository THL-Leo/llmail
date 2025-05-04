import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import fs from 'fs';
import path from 'path';

/**
 * API route to apply the database schema
 * WARNING: This should be properly secured in production
 */
export async function GET() {
  try {
    // Create only the profiles table for now (simplified)
    const schema = `
    -- PROFILES TABLE
    -- This extends the default auth.users table provided by Supabase Auth
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    -- Enable Row Level Security
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies for profiles table
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
      ) THEN
        CREATE POLICY "Users can view their own profile" 
          ON profiles FOR SELECT 
          USING (auth.uid() = id);
      END IF;
      
      IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
      ) THEN
        CREATE POLICY "Users can update their own profile" 
          ON profiles FOR UPDATE 
          USING (auth.uid() = id);
      END IF;
    END $$;
    `;
    
    // Run the schema SQL
    const { error } = await supabase.rpc('pgcrypto', { query: schema });
    
    if (error) {
      // Try a different approach
      try {
        // Execute raw SQL query (this is a fallback approach)
        const { error: rawError } = await supabase.from('_pgcrypto').select('*').limit(1);
        
        return NextResponse.json({
          success: false,
          message: 'Failed to apply schema',
          error: error.message,
          fallbackError: rawError?.message,
        }, { status: 500 });
      } catch (fallbackError) {
        return NextResponse.json({
          success: false,
          message: 'Failed to apply schema and fallback also failed',
          error: error.message,
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully applied database schema',
    });
    
  } catch (error) {
    console.error('Error applying schema:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}