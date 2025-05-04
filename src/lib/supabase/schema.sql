-- Database schema for Smart Email Manager with NextAuth integration

-- PROFILES TABLE (adjusted for NextAuth)
-- With NextAuth, user IDs are typically text, not UUIDs
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Using TEXT to match NextAuth's ID format
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- We use public policies for easier development
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;

CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT TO PUBLIC;
CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT TO PUBLIC;
CREATE POLICY "Anyone can update profiles" ON profiles FOR UPDATE TO PUBLIC;

-- EMAIL_ACCOUNTS TABLE
-- Stores information about connected email accounts
DROP TABLE IF EXISTS email_accounts CASCADE;
CREATE TABLE email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- TEXT to match profiles.id
  provider TEXT NOT NULL, -- 'gmail', 'outlook', etc.
  email TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, email)
);

-- Enable Row Level Security
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;

-- Create public policies for development
CREATE POLICY "Anyone can view email accounts" 
  ON email_accounts FOR SELECT TO PUBLIC;

CREATE POLICY "Anyone can update email accounts" 
  ON email_accounts FOR UPDATE TO PUBLIC;

CREATE POLICY "Anyone can insert email accounts" 
  ON email_accounts FOR INSERT TO PUBLIC;

CREATE POLICY "Anyone can delete email accounts" 
  ON email_accounts FOR DELETE TO PUBLIC;

-- EMAILS TABLE
-- Stores email metadata
DROP TABLE IF EXISTS emails CASCADE;
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- TEXT to match profiles.id
  remote_id TEXT NOT NULL, -- ID from email provider
  subject TEXT,
  from_email TEXT,
  from_name TEXT,
  to_emails TEXT[],
  cc_emails TEXT[],
  bcc_emails TEXT[],
  received_at TIMESTAMP WITH TIME ZONE,
  snippet TEXT,
  has_attachments BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  thread_id TEXT,
  labels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(account_id, remote_id)
);

-- Enable Row Level Security
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create public policies for development
CREATE POLICY "Anyone can view emails" 
  ON emails FOR SELECT TO PUBLIC;

CREATE POLICY "Anyone can update emails" 
  ON emails FOR UPDATE TO PUBLIC;

CREATE POLICY "Anyone can insert emails" 
  ON emails FOR INSERT TO PUBLIC;

CREATE POLICY "Anyone can delete emails" 
  ON emails FOR DELETE TO PUBLIC;

-- EMAIL_CLASSIFICATIONS TABLE
-- Stores Claude's analysis of emails
DROP TABLE IF EXISTS email_classifications CASCADE;
CREATE TABLE email_classifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- TEXT to match profiles.id
  importance_score INTEGER, -- 0-100
  category TEXT, -- 'work', 'personal', 'finance', etc.
  reason TEXT, -- Why this classification was made
  can_archive BOOLEAN DEFAULT FALSE,
  is_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(email_id)
);

-- Enable Row Level Security
ALTER TABLE email_classifications ENABLE ROW LEVEL SECURITY;

-- Create public policies for development
CREATE POLICY "Anyone can view email classifications" 
  ON email_classifications FOR SELECT TO PUBLIC;

CREATE POLICY "Anyone can update email classifications" 
  ON email_classifications FOR UPDATE TO PUBLIC;

CREATE POLICY "Anyone can insert email classifications" 
  ON email_classifications FOR INSERT TO PUBLIC;

CREATE POLICY "Anyone can delete email classifications" 
  ON email_classifications FOR DELETE TO PUBLIC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_account_id ON emails(account_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_email_class_email_id ON email_classifications(email_id);
CREATE INDEX IF NOT EXISTS idx_email_class_user_id ON email_classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user_id ON email_accounts(user_id);

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

DROP TRIGGER IF EXISTS update_email_accounts_updated_at ON email_accounts;
CREATE TRIGGER update_email_accounts_updated_at
BEFORE UPDATE ON email_accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON emails
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

DROP TRIGGER IF EXISTS update_email_classifications_updated_at ON email_classifications;
CREATE TRIGGER update_email_classifications_updated_at
BEFORE UPDATE ON email_classifications
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();