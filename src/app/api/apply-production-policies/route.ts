import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUserId } from '@/lib/auth/session';

/**
 * API route to apply production-ready security policies to the database tables
 * This should be secured and only accessible to admin users
 */
export async function POST(request: Request) {
  try {
    // In a production environment, we would check for authentication
    // For development/hackathon purposes, we'll allow unauthenticated access
    /*
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
      }, { status: 401 });
    }
    */
    
    // Get table to apply policies to (or 'all' for all tables)
    const { table = 'all' } = await request.json();
    
    // Define tables to process
    const tables = table === 'all' 
      ? ['profiles', 'email_accounts', 'emails', 'email_classifications'] 
      : [table];
    
    const results = [];
    
    // Apply policies to each table
    for (const tableName of tables) {
      try {
        // Try using the RPC function if it exists
        const { data, error } = await supabaseAdmin.rpc('apply_production_policies', { 
          table_name: tableName 
        });
        
        if (error) {
          // If RPC fails, include the SQL to be executed manually
          results.push({
            table: tableName,
            success: false,
            message: `Could not apply policies to ${tableName}`,
            error: error.message,
            manualSQL: `-- Find this SQL in src/lib/supabase/production-policies.sql`
          });
        } else {
          results.push({
            table: tableName,
            success: true,
            message: `Production policies applied to ${tableName}`,
            details: data
          });
        }
      } catch (e) {
        results.push({
          table: tableName,
          success: false,
          message: `Exception applying policies to ${tableName}`,
          error: (e as Error).message
        });
      }
    }
    
    const allSuccess = results.every(r => r.success);
    
    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? 'Production policies applied successfully' 
        : 'Some policies could not be applied',
      results
    });
    
  } catch (error) {
    console.error('Error applying production policies:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}