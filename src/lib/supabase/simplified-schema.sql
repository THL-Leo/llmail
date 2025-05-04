-- Simplified database schema for Smart Email Manager with NextAuth

-- PROFILES TABLE (simplified for NextAuth)
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Changed from UUID to TEXT to match NextAuth's ID format
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public policy - anyone can select (for dev purposes only, change in prod)
CREATE POLICY "Anyone can view profiles" 
  ON profiles FOR SELECT 
  TO PUBLIC;

-- Create function to update the updated_at field
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at field
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();