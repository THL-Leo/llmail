import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * API route to check Row Level Security status for database tables
 */
export async function GET() {
  try {
    // We'll use direct queries to check RLS status for each table
    const checkRlsForTable = async (tableName: string) => {
      try {
        // This query checks if RLS is enabled for the given table
        const { data, error } = await supabaseAdmin.rpc('has_rls_enabled', { 
          table_name: tableName 
        });
        
        if (error) {
          // If the function doesn't exist, try a direct query to pg_class
          const { data: pgData, error: pgError } = await supabaseAdmin
            .from('pg_class')
            .select('relrowsecurity')
            .eq('relname', tableName)
            .single();
          
          if (pgError) {
            return {
              table: tableName,
              rlsEnabled: false,
              error: 'Could not determine RLS status',
              errorDetail: pgError.message
            };
          }
          
          return {
            table: tableName,
            rlsEnabled: pgData?.relrowsecurity || false,
            method: 'pg_class_direct'
          };
        }
        
        return {
          table: tableName,
          rlsEnabled: data,
          method: 'rpc_function'
        };
      } catch (e) {
        return {
          table: tableName,
          rlsEnabled: false,
          error: 'Exception checking RLS status',
          errorDetail: (e as Error).message
        };
      }
    };
    
    // Define the tables we want to check
    const tables = [
      'profiles',
      'email_accounts',
      'emails',
      'email_classifications'
    ];
    
    // Check RLS status for each table
    const results = await Promise.all(tables.map(checkRlsForTable));
    
    // Return the results
    return NextResponse.json({
      success: true,
      message: 'Row Level Security status check completed',
      results
    });
    
  } catch (error) {
    console.error('Error checking RLS status:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}