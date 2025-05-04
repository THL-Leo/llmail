-- Production-ready Row Level Security policies
-- For use when deploying the application to production

-- Profiles Table Policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Email Accounts Table Policies
DROP POLICY IF EXISTS "Anyone can view email accounts" ON email_accounts;
DROP POLICY IF EXISTS "Anyone can update email accounts" ON email_accounts;
DROP POLICY IF EXISTS "Anyone can insert email accounts" ON email_accounts;
DROP POLICY IF EXISTS "Anyone can delete email accounts" ON email_accounts;

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

-- Emails Table Policies
DROP POLICY IF EXISTS "Anyone can view emails" ON emails;
DROP POLICY IF EXISTS "Anyone can update emails" ON emails;
DROP POLICY IF EXISTS "Anyone can insert emails" ON emails;
DROP POLICY IF EXISTS "Anyone can delete emails" ON emails;

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

-- Email Classifications Table Policies
DROP POLICY IF EXISTS "Anyone can view email classifications" ON email_classifications;
DROP POLICY IF EXISTS "Anyone can update email classifications" ON email_classifications;
DROP POLICY IF EXISTS "Anyone can insert email classifications" ON email_classifications;
DROP POLICY IF EXISTS "Anyone can delete email classifications" ON email_classifications;

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