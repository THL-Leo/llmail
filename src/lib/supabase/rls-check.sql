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