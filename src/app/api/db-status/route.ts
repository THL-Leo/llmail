import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * API route to check database status and table existence
 * Shows the status of all required tables for the Smart Email Manager
 */
export async function GET() {
  try {
    // Check each table individually using direct queries
    // This is more reliable than checking metadata tables
    
    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);
    
    // Check email_accounts table
    const { data: accountsData, error: accountsError } = await supabaseAdmin
      .from('email_accounts')
      .select('id')
      .limit(1);
    
    // Check emails table
    const { data: emailsData, error: emailsError } = await supabaseAdmin
      .from('emails')
      .select('id')
      .limit(1);
    
    // Check email_classifications table
    const { data: classificationsData, error: classificationsError } = await supabaseAdmin
      .from('email_classifications')
      .select('id')
      .limit(1);
    
    // Determine table existence based on errors
    // A table exists if the error isn't a relation-not-found error
    const profilesExists = !profilesError || !profilesError.message.includes('does not exist');
    const accountsExists = !accountsError || !accountsError.message.includes('does not exist');
    const emailsExists = !emailsError || !emailsError.message.includes('does not exist');
    const classificationsExists = !classificationsError || !classificationsError.message.includes('does not exist');
    
    // If all tables give error and one specifically mentions connection, it's likely a connection issue
    const connectionError = profilesError && accountsError && emailsError && classificationsError &&
      (profilesError.message.includes('connection') || accountsError.message.includes('connection') ||
       emailsError.message.includes('connection') || classificationsError.message.includes('connection'));
    
    if (connectionError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to Supabase',
        error: profilesError.message,
      }, { status: 500 });
    }
    
    // Build table status report
    const tableStatus = [
      { name: 'profiles', exists: profilesExists },
      { name: 'email_accounts', exists: accountsExists },
      { name: 'emails', exists: emailsExists },
      { name: 'email_classifications', exists: classificationsExists }
    ];
    
    // Calculate existing table list
    const existingTables = tableStatus
      .filter(table => table.exists)
      .map(table => table.name);
    
    return NextResponse.json({
      success: true,
      message: 'Database status check completed',
      connection: 'Connected',
      allTables: existingTables,
      requiredTables: tableStatus,
      databaseReady: profilesExists && accountsExists && emailsExists && classificationsExists
    });
    
  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}