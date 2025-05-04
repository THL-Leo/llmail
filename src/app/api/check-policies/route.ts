import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * API route to check security policies for database tables
 */
export async function GET() {
  try {
    // Using a SQL query to get all policies from pg_policy
    const { data, error } = await supabaseAdmin.rpc('get_all_policies');
    
    if (error) {
      // If the RPC function doesn't exist, fall back to using a JSON response
      return NextResponse.json({
        success: false,
        message: 'Could not fetch security policies',
        error: error.message,
        note: 'Consider running the helper function SQL script to enable policy checking'
      }, { status: 500 });
    }
    
    // Process the data for better presentation
    const policiesByTable: Record<string, any[]> = {};
    
    // If data is an array, process it
    if (Array.isArray(data)) {
      data.forEach(policy => {
        if (!policiesByTable[policy.tablename]) {
          policiesByTable[policy.tablename] = [];
        }
        policiesByTable[policy.tablename].push({
          name: policy.policyname,
          command: policy.cmd,
          using: policy.using_expression,
          withCheck: policy.with_check_expression
        });
      });
    }
    
    // Check our tables of interest
    const tables = [
      'profiles',
      'email_accounts',
      'emails',
      'email_classifications'
    ];
    
    const tablePolicies = tables.map(tableName => ({
      table: tableName,
      policies: policiesByTable[tableName] || [],
      hasPolicies: (policiesByTable[tableName]?.length || 0) > 0
    }));
    
    // Return the results
    return NextResponse.json({
      success: true,
      message: 'Security policies check completed',
      tablePolicies,
      allPolicies: data
    });
    
  } catch (error) {
    console.error('Error checking security policies:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}