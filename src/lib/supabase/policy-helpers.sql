-- Helper functions for checking and managing Row Level Security policies

-- Function to get all policies in the database
CREATE OR REPLACE FUNCTION get_all_policies()
RETURNS TABLE (
  policyname text,
  tablename text,
  schemaname text,
  cmd text,
  roles text[],
  using_expression text,
  with_check_expression text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    polname::text AS policyname,
    tablename::text,
    schemaname::text,
    CASE
      WHEN polcmd = 'r' THEN 'SELECT'
      WHEN polcmd = 'a' THEN 'INSERT'
      WHEN polcmd = 'w' THEN 'UPDATE'
      WHEN polcmd = 'd' THEN 'DELETE'
      WHEN polcmd = '*' THEN 'ALL'
      ELSE polcmd::text
    END AS cmd,
    polroles AS roles,
    pg_get_expr(polqual, polrelid, true) AS using_expression,
    pg_get_expr(polwithcheck, polrelid, true) AS with_check_expression
  FROM pg_policy
  JOIN pg_class ON pg_class.oid = pg_policy.polrelid
  JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
  WHERE 
    schemaname = 'public'
  ORDER BY schemaname, tablename, policyname;
$$;

-- Function to apply production-ready policies to a table
CREATE OR REPLACE FUNCTION apply_production_policies(table_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  IF table_name = 'profiles' THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
    DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
    DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;
    
    -- Create new policies
    CREATE POLICY "Users can view their own profile" 
      ON profiles FOR SELECT 
      USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile" 
      ON profiles FOR UPDATE 
      USING (auth.uid() = id);

    CREATE POLICY "Service role can insert profiles" 
      ON profiles FOR INSERT 
      WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');
    
    result = json_build_object('success', true, 'table', table_name, 'message', 'Production policies applied');
    
  ELSIF table_name = 'email_accounts' THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view email accounts" ON email_accounts;
    DROP POLICY IF EXISTS "Anyone can update email accounts" ON email_accounts;
    DROP POLICY IF EXISTS "Anyone can insert email accounts" ON email_accounts;
    DROP POLICY IF EXISTS "Anyone can delete email accounts" ON email_accounts;
    
    -- Create new policies
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
    
    result = json_build_object('success', true, 'table', table_name, 'message', 'Production policies applied');
    
  ELSIF table_name = 'emails' THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view emails" ON emails;
    DROP POLICY IF EXISTS "Anyone can update emails" ON emails;
    DROP POLICY IF EXISTS "Anyone can insert emails" ON emails;
    DROP POLICY IF EXISTS "Anyone can delete emails" ON emails;
    
    -- Create new policies
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
    
    result = json_build_object('success', true, 'table', table_name, 'message', 'Production policies applied');
    
  ELSIF table_name = 'email_classifications' THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Anyone can view email classifications" ON email_classifications;
    DROP POLICY IF EXISTS "Anyone can update email classifications" ON email_classifications;
    DROP POLICY IF EXISTS "Anyone can insert email classifications" ON email_classifications;
    DROP POLICY IF EXISTS "Anyone can delete email classifications" ON email_classifications;
    
    -- Create new policies
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
    
    result = json_build_object('success', true, 'table', table_name, 'message', 'Production policies applied');
    
  ELSE
    result = json_build_object('success', false, 'table', table_name, 'message', 'Unknown table');
  END IF;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false, 
    'table', table_name, 
    'message', 'Error applying policies', 
    'error', SQLERRM
  );
END;
$$;