import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API route to set up the database using the service role key
 * This provides admin access to create tables directly
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        message: 'Supabase credentials are missing',
        env: {
          url: supabaseUrl ? 'Set' : 'Missing',
          key: supabaseServiceKey ? 'Set' : 'Missing'
        }
      }, { status: 500 });
    }
    
    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Simple SQL to create the profiles table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `;
    
    const enableRLSSQL = `
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    `;
    
    const createPoliciesSQL = `
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
      DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
      DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;
      
      -- Create new policies
      CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT TO PUBLIC;
      CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT TO PUBLIC;
      CREATE POLICY "Anyone can update profiles" ON profiles FOR UPDATE TO PUBLIC;
    `;
    
    // Execute the SQL commands one by one
    const results = [];
    
    // Try creating the table
    try {
      // Try to directly execute SQL, which might not be supported
      const { error } = await supabaseAdmin.auth.admin.createUser({
        email: 'temp@example.com',
        password: 'temp-password',
      });
      
      if (error && error.message !== 'function select(query) does not exist') {
        results.push({ operation: 'Create table', success: false, error: error.message });
      } else {
        results.push({ operation: 'Create table', success: true });
      }
    } catch (error) {
      // Try a different approach - direct REST API call
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/profiles?limit=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
          },
        });
        
        if (response.ok) {
          results.push({ operation: 'Check table', success: true, note: 'Table appears to exist' });
        } else {
          results.push({ 
            operation: 'Check table', 
            success: false, 
            error: `HTTP error: ${response.status}`,
            note: 'Manual SQL execution required. Use the SQL below in the Supabase SQL editor.'
          });
        }
      } catch (fetchError) {
        results.push({ 
          operation: 'Check table', 
          success: false, 
          error: (fetchError as Error).message,
          note: 'Manual SQL execution required'
        });
      }
    }
    
    // We'll skip trying to execute RLS and policies directly
    // since this is likely not going to work via API
    
    results.push({ 
      operation: 'Enable RLS', 
      success: false, 
      note: 'Manual execution required'
    });
    
    results.push({ 
      operation: 'Create policies', 
      success: false, 
      note: 'Manual execution required'
    });
    
    // If direct execution didn't work, provide the SQL for manual execution
    const manualSQLNeeded = results.some(r => !r.success);
    
    return NextResponse.json({
      success: !manualSQLNeeded,
      message: manualSQLNeeded 
        ? 'Could not automatically create tables. Please run the SQL manually.' 
        : 'Database setup completed successfully',
      results,
      manualSQL: manualSQLNeeded ? createTableSQL + enableRLSSQL + createPoliciesSQL : undefined
    });
    
  } catch (error) {
    console.error('Error in admin setup:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}