import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to provide SQL files as text for the UI
 */
export async function GET(request: Request) {
  try {
    // Get the SQL type from the URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'utility';
    
    let filePath = '';
    
    // Determine which file to read
    switch (type) {
      case 'utility':
        filePath = path.join(process.cwd(), 'src/lib/supabase/utility-functions.sql');
        break;
      case 'policies':
        filePath = path.join(process.cwd(), 'src/lib/supabase/production-policies.sql');
        break;
      default:
        filePath = path.join(process.cwd(), 'src/lib/supabase/utility-functions.sql');
    }
    
    // Read the file
    let sql = '';
    try {
      sql = fs.readFileSync(filePath, 'utf8');
    } catch (fileError) {
      // If file reading fails, provide a hardcoded version
      if (type === 'utility') {
        sql = `-- Utility functions for database management
-- Copy and paste this into the Supabase SQL Editor to install these functions

-- Function to check if RLS is enabled for a table
CREATE OR REPLACE FUNCTION has_rls_enabled(table_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT relrowsecurity
  FROM pg_class
  WHERE oid = (table_name::regclass)::oid;
$$;

-- Function to list all tables in the public schema
CREATE OR REPLACE FUNCTION list_tables()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT array_agg(tablename)
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public';
$$;

-- Function to get all policies in the database
CREATE OR REPLACE FUNCTION get_all_policies()
RETURNS TABLE (
  policyname text,
  tablename text,
  schemaname text,
  cmd text,
  roles text[],
  using_expression text,
  with_check_expression text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    polname::text AS policyname,
    tablename::text,
    schemaname::text,
    CASE
      WHEN polcmd = 'r' THEN 'SELECT'
      WHEN polcmd = 'a' THEN 'INSERT'
      WHEN polcmd = 'w' THEN 'UPDATE'
      WHEN polcmd = 'd' THEN 'DELETE'
      WHEN polcmd = '*' THEN 'ALL'
      ELSE polcmd::text
    END AS cmd,
    polroles AS roles,
    pg_get_expr(polqual, polrelid, true) AS using_expression,
    pg_get_expr(polwithcheck, polrelid, true) AS with_check_expression
  FROM pg_policy
  JOIN pg_class ON pg_class.oid = pg_policy.polrelid
  JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE 
    schemaname = 'public'
  ORDER BY schemaname, tablename, policyname;
$$;

-- Execute SQL safely via RPC
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;`;
      }
    }
    
    return NextResponse.json({ 
      sql,
      type
    });
    
  } catch (error) {
    console.error('Error fetching SQL:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}