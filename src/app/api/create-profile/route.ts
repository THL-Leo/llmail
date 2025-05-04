import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * API route to manually create a profile in Supabase for the current user
 */
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'You must be signed in to create a profile',
      }, { status: 401 });
    }
    
    const user = session.user;
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Profile already exists',
        user: existingUser,
      });
    }
    
    // Create the user profile
    console.log('Creating profile for user:', { 
      id: user.id, 
      email: user.email,
      name: user.name
    });
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email || '',
          full_name: user.name || '',
          avatar_url: user.image || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to create profile',
        error: error.message,
        code: error.code,
        details: error.details,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      user: data?.[0] || null,
    });
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}