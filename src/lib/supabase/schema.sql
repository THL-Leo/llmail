-- Database schema for Smart Email Manager

-- USERS TABLE
-- This extends the default auth.users table provided by Supabase Auth
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- EMAIL_ACCOUNTS TABLE
-- Stores information about connected email accounts
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Create policies for email_accounts table
CREATE POLICY "Users can view their own email accounts" 
  ON email_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own email accounts" 
  ON email_accounts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email accounts" 
  ON email_accounts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email accounts" 
  ON email_accounts FOR DELETE 
  USING (auth.uid() = user_id);

-- EMAILS TABLE
-- Stores email metadata
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Create policies for emails table
CREATE POLICY "Users can view their own emails" 
  ON emails FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails" 
  ON emails FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emails" 
  ON emails FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emails" 
  ON emails FOR DELETE 
  USING (auth.uid() = user_id);

-- EMAIL_CLASSIFICATIONS TABLE
-- Stores Claude's analysis of emails
CREATE TABLE IF NOT EXISTS email_classifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Create policies for email_classifications table
CREATE POLICY "Users can view their own email classifications" 
  ON email_classifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own email classifications" 
  ON email_classifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email classifications" 
  ON email_classifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email classifications" 
  ON email_classifications FOR DELETE 
  USING (auth.uid() = user_id);

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
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_email_accounts_updated_at
BEFORE UPDATE ON email_accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_emails_updated_at
BEFORE UPDATE ON emails
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_email_classifications_updated_at
BEFORE UPDATE ON email_classifications
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();