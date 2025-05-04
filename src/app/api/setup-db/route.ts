import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

/**
 * API route to set up the full database schema for the Smart Email Manager
 */
export async function POST(request: Request) {
  try {
    // Parse request to see if a specific schema type is requested
    const { schemaType = 'full' } = await request.json().catch(() => ({ schemaType: 'full' }));
    
    // Determine which schema file to use
    const schemaFile = schemaType === 'simplified' 
      ? 'simplified-schema.sql' 
      : 'schema.sql';
    
    // Read the schema
    const schemaPath = path.join(process.cwd(), `src/lib/supabase/${schemaFile}`);
    let schema: string;
    
    try {
      schema = fs.readFileSync(schemaPath, 'utf8');
    } catch (error) {
      console.error(`Error reading schema file ${schemaFile}:`, error);
      return NextResponse.json({
        success: false,
        message: `Could not read schema file: ${schemaFile}`,
        error: (error as Error).message,
      }, { status: 500 });
    }
    
    // Since we can't easily run raw SQL through the JavaScript client,
    // we'll provide the schema for manual execution in the Supabase SQL editor
    return NextResponse.json({
      success: true,
      message: 'Schema prepared for manual execution',
      schema: schema,
      instructions: 'To create the tables, copy this schema and run it in the Supabase SQL Editor',
      schemaFile
    });
    
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}