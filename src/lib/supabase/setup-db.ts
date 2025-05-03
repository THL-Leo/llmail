import { supabaseAdmin } from './admin';
import fs from 'fs';
import path from 'path';

/**
 * This script runs the schema.sql file against your Supabase database
 * It should be run manually during initial setup and database migrations
 * 
 * To run:
 * 1. Make sure your .env.local file has the correct Supabase credentials
 * 2. Execute this file with: npx tsx src/lib/supabase/setup-db.ts
 */
async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    const schemaPath = path.join(process.cwd(), 'src/lib/supabase/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running SQL schema...');
    
    // Run SQL as a raw query since the sql namespace might not be available in all versions
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('Error setting up database:', error);
      process.exit(1);
    }
    
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to set up database:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  setupDatabase();
}