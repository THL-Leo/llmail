"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, RefreshCw, Shield, Copy } from "lucide-react";
import Link from "next/link";

export default function SecurityPoliciesPage() {
  const [loading, setLoading] = useState(false);
  const [rlsStatus, setRlsStatus] = useState<any>(null);
  const [policiesStatus, setPoliciesStatus] = useState<any>(null);
  const [productionSql, setProductionSql] = useState("");
  const [utilitySql, setUtilitySql] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);
  const [applyResult, setApplyResult] = useState<any>(null);

  // Fetch RLS status on component mount
  useEffect(() => {
    fetchRlsStatus();
    fetchProductionSql();
    fetchUtilitySql();
  }, []);

  const fetchRlsStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/check-rls");
      const rlsData = await res.json();
      setRlsStatus(rlsData);
      
      // Also fetch policies data
      const policiesRes = await fetch("/api/check-policies");
      const policiesData = await policiesRes.json();
      setPoliciesStatus(policiesData);
    } catch (error) {
      console.error("Error fetching RLS status:", error);
      setRlsStatus({ 
        success: false, 
        message: "Failed to fetch RLS status"
      });
    }
    setLoading(false);
  };

  const fetchProductionSql = async () => {
    try {
      // In a real app, fetch this from an API endpoint or read from a file
      // For simplicity, we'll just include it directly
      const response = await fetch("/api/setup-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          schemaType: "policies"
        })
      });
      
      const data = await response.json();
      if (data.schema) {
        setProductionSql(data.schema);
      }
    } catch (error) {
      console.error("Error fetching production SQL:", error);
    }
  };

  const fetchUtilitySql = async () => {
    try {
      // In a real app, fetch this from an API endpoint
      // For now, we'll just simulate the response
      const response = await fetch('/api/sql-helper?type=utility');
      const data = await response.json();
      
      if (data.error) {
        // If the endpoint doesn't exist, use a hardcoded value
        setUtilitySql(`-- Utility functions for database management
-- Copy and paste this into the Supabase SQL Editor to install these functions

-- Function to check if RLS is enabled for a table
CREATE OR REPLACE FUNCTION has_rls_enabled(table_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT relrowsecurity
  FROM pg_class
  WHERE oid = (table_name::regclass)::oid;
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
$$;`);
      } else if (data.sql) {
        setUtilitySql(data.sql);
      }
    } catch (error) {
      // Handle fetch error by using hardcoded value
      setUtilitySql(`-- Utility functions SQL could not be fetched
-- Please check src/lib/supabase/utility-functions.sql for the actual SQL`);
    }
  };

  const copyToClipboard = async (sqlType: 'production' | 'utility') => {
    const sqlText = sqlType === 'production' ? productionSql : utilitySql;
    if (sqlText) {
      try {
        await navigator.clipboard.writeText(sqlText);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2000);
      } catch (err) {
        console.error("Failed to copy SQL:", err);
      }
    }
  };

  const applyProductionPolicies = async (table: string = 'all') => {
    setLoading(true);
    try {
      const res = await fetch("/api/apply-production-policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ table })
      });
      
      const data = await res.json();
      setApplyResult(data);
      
      // Refresh status after applying policies
      fetchRlsStatus();
    } catch (error) {
      setApplyResult({
        success: false,
        message: "Failed to apply production policies",
        error: (error as Error).message
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-8 mb-12">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Security Policies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage Row Level Security and access policies for your database
            </p>
          </div>
          
          <Separator className="w-1/2 my-6" />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Row Level Security Status
            </CardTitle>
            <CardDescription>
              Check if Row Level Security is enabled for your database tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : rlsStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {rlsStatus.results?.map((result: any) => (
                    <Card key={result.table} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{result.table}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {result.method || ''}
                          </p>
                        </div>
                        <Badge variant={result.rlsEnabled ? "default" : "destructive"}>
                          {result.rlsEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      {result.error && (
                        <p className="text-xs text-red-500 mt-2">{result.error}</p>
                      )}
                    </Card>
                  ))}
                </div>
                
                {policiesStatus && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Security Policies</h3>
                    {policiesStatus.tablePolicies?.map((tablePolicy: any) => (
                      <Card key={tablePolicy.table} className="p-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium">{tablePolicy.table}</h3>
                          <Badge variant={tablePolicy.hasPolicies ? "default" : "outline"}>
                            {tablePolicy.hasPolicies 
                              ? `${tablePolicy.policies.length} Policies` 
                              : "No Policies"}
                          </Badge>
                        </div>
                        
                        {tablePolicy.policies.length > 0 && (
                          <div className="mt-2 text-xs space-y-2">
                            {tablePolicy.policies.map((policy: any, idx: number) => (
                              <div key={idx} className="border p-2 rounded-md">
                                <div className="font-medium">{policy.name}</div>
                                <div><span className="opacity-70">Command:</span> {policy.command}</div>
                                {policy.using && (
                                  <div><span className="opacity-70">Using:</span> {policy.using}</div>
                                )}
                                {policy.withCheck && (
                                  <div><span className="opacity-70">With Check:</span> {policy.withCheck}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Alert>
                <AlertTitle>No Status Data</AlertTitle>
                <AlertDescription>
                  Click the refresh button to check RLS status.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={fetchRlsStatus}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Status"}
              {!loading && <RefreshCw className="h-4 w-4 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Production Security
            </CardTitle>
            <CardDescription>
              Apply production-ready security policies to your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Development vs Production Security</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  In development mode, tables use permissive policies for easier testing. 
                  For production, we recommend switching to strict user-based policies.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Development: <span className="font-mono text-xs">TO PUBLIC</span> allows any operation</li>
                  <li>Production: <span className="font-mono text-xs">auth.uid() = user_id</span> restricts to owner</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => applyProductionPolicies('profiles')}
                  disabled={loading}
                  variant="outline"
                >
                  Secure Profiles Table
                </Button>
                <Button 
                  onClick={() => applyProductionPolicies('email_accounts')}
                  disabled={loading}
                  variant="outline"
                >
                  Secure Email Accounts Table
                </Button>
                <Button 
                  onClick={() => applyProductionPolicies('emails')}
                  disabled={loading}
                  variant="outline"
                >
                  Secure Emails Table
                </Button>
                <Button 
                  onClick={() => applyProductionPolicies('email_classifications')}
                  disabled={loading}
                  variant="outline"
                >
                  Secure Classifications Table
                </Button>
              </div>
              
              <Button 
                onClick={() => applyProductionPolicies()}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Applying..." : "Apply All Production Policies"}
              </Button>
              
              {applyResult && (
                <Alert variant={applyResult.success ? "default" : "destructive"}>
                  {applyResult.success ? 
                    <CheckCircle2 className="h-4 w-4" /> : 
                    <XCircle className="h-4 w-4" />}
                  <AlertTitle>
                    {applyResult.success ? "Policies Applied" : "Operation Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Message:</strong> {applyResult.message}
                      </div>
                      {applyResult.error && (
                        <div>
                          <strong>Error:</strong> {applyResult.error}
                        </div>
                      )}
                      {applyResult.results && (
                        <div className="text-xs grid grid-cols-2 gap-2 mt-2">
                          {applyResult.results.map((result: any, idx: number) => (
                            <div key={idx} className={`p-2 rounded-md ${result.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                              <p className="font-medium">{result.table}</p>
                              <p>{result.message}</p>
                              {result.error && <p className="text-red-500">{result.error}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Manual SQL Execution
            </CardTitle>
            <CardDescription>
              SQL scripts for manually applying security policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="policies">
              <TabsList className="mb-4">
                <TabsTrigger value="policies">Security Policies</TabsTrigger>
                <TabsTrigger value="utility">Utility Functions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="policies" className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Production Security SQL:</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => copyToClipboard('production')}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedSql ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  value={productionSql}
                  readOnly
                  className="font-mono h-80 text-xs"
                  placeholder="Loading SQL..."
                />
                <Alert className="mt-2">
                  <AlertTitle>Production Security Policies</AlertTitle>
                  <AlertDescription>
                    These policies restrict data access to the user who owns it.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="utility" className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Utility Functions SQL:</h4>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => copyToClipboard('utility')}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedSql ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  value={utilitySql}
                  readOnly
                  className="font-mono h-80 text-xs"
                  placeholder="Loading SQL..."
                />
                <Alert variant="warning" className="mt-2">
                  <AlertTitle>Required Utility Functions</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">You must run this SQL first to enable the security policy tools.</p>
                    <ol className="list-decimal ml-4 text-sm space-y-1">
                      <li>Copy this SQL</li>
                      <li>Paste it into the Supabase SQL Editor</li>
                      <li>Run it to create the utility functions</li>
                      <li>Return to this page to manage security policies</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
            
            <Alert>
              <AlertTitle>Manual Execution</AlertTitle>
              <AlertDescription>
                If the automated process fails, you can copy this SQL and run it in the Supabase SQL Editor.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/db-setup">
                Database Setup
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}