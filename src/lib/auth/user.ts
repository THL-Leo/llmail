import { supabaseAdmin } from "../supabase/admin";

/**
 * Creates a user in Supabase if they don't already exist
 * Called during the sign-in callback from NextAuth
 * Uses the admin client to ensure necessary permissions
 */
export async function createUserIfNotExists(user: { 
  id?: string; 
  email?: string | null; 
  name?: string | null; 
  image?: string | null; 
}) {
  if (!user.email) {
    throw new Error("User email is required");
  }
  
  if (!user.id) {
    throw new Error("User ID is required");
  }
  
  const email = user.email;
  const userId = user.id;
  
  console.log("Creating/checking user in profiles table", { userId, email });
  
  try {
    // First, check if the profiles table exists
    try {
      const { data: tables, error: tableError } = await supabaseAdmin
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .eq('tablename', 'profiles');
      
      if (tableError) {
        console.log("Error checking if profiles table exists:", tableError.message);
        // Continue anyway
      } else if (!tables || tables.length === 0) {
        console.log("Profiles table doesn't exist - attempting to create it");
        // We'll still try to insert, which might create the table or fail gracefully
      } else {
        console.log("Profiles table exists");
      }
    } catch (e) {
      console.log("Exception checking for profiles table:", e);
      // Continue anyway
    }
    
    // Check if user already exists in profiles table
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    // Log the result of the check
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        console.log("User not found, will create new profile");
      } else {
        console.log("Error checking for user:", fetchError.message, fetchError.code, fetchError.details);
      }
    } else {
      console.log("User found in database:", existingUser.email);
      return true; // User exists, we're done
    }
    
    // Create the user profile - with additional error handling
    try {
      console.log("Attempting to create user profile with:", { 
        id: userId, 
        email,
        name: user.name || '',
      });
      
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            full_name: user.name || "",
            avatar_url: user.image || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ]);
      
      if (insertError) {
        console.error("Error inserting user:", insertError.message, insertError.code, insertError.details);
        
        // If the error is a unique constraint violation, the user might already exist
        if (insertError.code === '23505') {
          console.log("User might already exist (constraint violation)");
          return true;
        }
        
        throw new Error(`Error creating user: ${insertError.message}`);
      }
      
      console.log("User created successfully");
      return true;
    } catch (insertErr) {
      console.error("Exception during insert:", insertErr);
      throw insertErr;
    }
  } catch (error) {
    console.error("Unexpected error in createUserIfNotExists:", error);
    throw error;
  }
}