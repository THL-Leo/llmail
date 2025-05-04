-- Helpful utility functions for the database

-- Function to check if a table has RLS enabled
CREATE OR REPLACE FUNCTION has_rls_enabled(table_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT relrowsecurity
  FROM pg_class
  WHERE oid = (table_name::regclass)::oid;
$$;

-- Function to execute SQL statements safely via RPC
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Function to list all tables in the public schema
CREATE OR REPLACE FUNCTION list_tables()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT array_agg(tablename)
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public';
$$;

-- Function to check if all required tables exist
CREATE OR REPLACE FUNCTION check_tables_exist()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  required_tables text[] := ARRAY['profiles', 'email_accounts', 'emails', 'email_classifications'];
  existing_tables text[];
  missing_tables text[];
BEGIN
  -- Get all tables in the public schema
  SELECT array_agg(tablename) INTO existing_tables
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public';
  
  -- Find missing tables
  SELECT array_agg(t) INTO missing_tables
  FROM unnest(required_tables) AS t
  WHERE t <> ALL(existing_tables);
  
  -- Return the result
  RETURN json_build_object(
    'success', missing_tables IS NULL OR array_length(missing_tables, 1) IS NULL,
    'existing_tables', existing_tables,
    'missing_tables', missing_tables
  );
END;
$$;