"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle2, XCircle, ArrowRight, Home, RefreshCw, Copy } from "lucide-react";
import Link from "next/link";

export default function DbSetupPage() {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [schema, setSchema] = useState("");
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [sql, setSql] = useState(`-- Creates the profiles table for NextAuth integration
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security but with public policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON profiles;

-- Create permissive policies for development
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT TO PUBLIC;
CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT TO PUBLIC;
CREATE POLICY "Anyone can update profiles" ON profiles FOR UPDATE TO PUBLIC;`);
  
  // Fetch database status when the component mounts
  useEffect(() => {
    fetchDatabaseStatus();
  }, []);
  
  const fetchDatabaseStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch (error) {
      console.error("Error fetching database status:", error);
      setDbStatus({ 
        success: false, 
        message: "Failed to fetch database status",
        error: (error as Error).message 
      });
    }
    setStatusLoading(false);
  };
  
  const executeSQL = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      setResult(data);
      // Refresh database status after executing SQL
      fetchDatabaseStatus();
    } catch (error) {
      setResult({ 
        success: false, 
        message: (error as Error).message,
        error: (error as Error).toString()
      });
    }
    setLoading(false);
  };
  
  const getSchema = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/setup-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          schemaType: type
        }),
      });
      const data = await res.json();
      setResult(data);
      setSchema(data.schema || "");
      // Refresh database status after setup
      fetchDatabaseStatus();
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Failed to get ${type} schema`,
        error: (error as Error).toString()
      });
    }
    setLoading(false);
  };
  
  const copySchemaToClipboard = async () => {
    if (schema) {
      try {
        await navigator.clipboard.writeText(schema);
        setCopiedSchema(true);
        setTimeout(() => setCopiedSchema(false), 2000);
      } catch (err) {
        console.error("Failed to copy schema:", err);
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-8 mb-12">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Database Setup</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Set up and manage your Supabase database for Smart Email Manager
            </p>
          </div>
          
          <Separator className="w-1/2 my-6" />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Database Status
            </CardTitle>
            <CardDescription>
              Check the current status of your database tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : dbStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Connection:</span>
                  <Badge variant={dbStatus.success ? "default" : "destructive"}>
                    {dbStatus.success ? "Connected" : "Failed"}
                  </Badge>
                </div>
                
                {dbStatus.success && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-medium">Required Tables:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {dbStatus.requiredTables?.map((table: any) => (
                          <div key={table.name} className="flex items-center gap-2">
                            {table.exists ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>{table.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Database Ready:</span>
                      <Badge className="ml-2" variant={dbStatus.databaseReady ? "default" : "outline"}>
                        {dbStatus.databaseReady ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </>
                )}
                
                {!dbStatus.success && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>{dbStatus.message}</p>
                        {dbStatus.error && <div><strong>Error:</strong> {dbStatus.error}</div>}
                        <div className="mt-4 text-sm border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 dark:bg-amber-950 dark:border-amber-700">
                          <p className="font-medium">Troubleshooting:</p>
                          <ol className="list-decimal ml-4 mt-1 space-y-1">
                            <li>Check your Supabase environment variables in .env.local</li>
                            <li>Make sure Supabase is running and accessible</li>
                            <li>Try manually creating the tables using the schema below</li>
                            <li>After creating tables, refresh this page</li>
                          </ol>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert>
                <AlertTitle>No Status Data</AlertTitle>
                <AlertDescription>
                  Click the refresh button to check database status.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={fetchDatabaseStatus}
              disabled={statusLoading}
            >
              {statusLoading ? "Refreshing..." : "Refresh Status"}
              {!statusLoading && <RefreshCw className="h-4 w-4 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Schema Installation
            </CardTitle>
            <CardDescription>
              Install the database schema for Smart Email Manager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Manual Schema Installation</AlertTitle>
              <AlertDescription>
                Due to limitations with the Supabase JavaScript client, you'll need to run the SQL schema manually in the Supabase SQL Editor.
                Select a schema below to view it, then copy and paste it into your Supabase SQL Editor.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="full">
              <TabsList className="mb-4">
                <TabsTrigger value="full">Full Schema</TabsTrigger>
                <TabsTrigger value="simplified">Simplified Schema</TabsTrigger>
                <TabsTrigger value="custom">Custom SQL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="full" className="space-y-4">
                <div className="prose dark:prose-invert">
                  <h3 className="text-lg font-medium">Full Database Schema</h3>
                  <p>
                    This complete database schema includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Profiles table for user data</li>
                    <li>Email accounts table for connected email services</li>
                    <li>Emails table to store email metadata</li>
                    <li>Email classifications table for Claude's analysis</li>
                    <li>Row Level Security policies for all tables</li>
                    <li>Appropriate indexes for optimal performance</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => getSchema('full')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Loading..." : "Load Full Schema"}
                </Button>
                
                {schema && result?.schemaFile === 'schema.sql' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">SQL Schema:</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={copySchemaToClipboard}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedSchema ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={schema}
                      readOnly
                      className="font-mono h-80 text-xs"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="simplified" className="space-y-4">
                <div className="prose dark:prose-invert">
                  <h3 className="text-lg font-medium">Simplified Schema</h3>
                  <p>
                    Install only the profiles table for user authentication with NextAuth.
                    This is useful for initial setup and testing.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Profiles table for user data</li>
                    <li>Basic Row Level Security policies</li>
                    <li>Minimal schema for getting started</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => getSchema('simplified')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Loading..." : "Load Simplified Schema"}
                </Button>
                
                {schema && result?.schemaFile === 'simplified-schema.sql' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">SQL Schema:</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={copySchemaToClipboard}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedSchema ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <Textarea
                      value={schema}
                      readOnly
                      className="font-mono h-80 text-xs"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="prose dark:prose-invert">
                  <h3 className="text-lg font-medium">Custom SQL</h3>
                  <p>
                    Write and execute custom SQL commands for your database.
                    Useful for advanced configurations or specific modifications.
                  </p>
                </div>
                
                <Textarea
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  placeholder="Enter SQL to execute..."
                  className="font-mono h-80"
                />
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={copySchemaToClipboard}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  
                  <Button 
                    onClick={executeSQL} 
                    disabled={loading || !sql.trim()}
                  >
                    {loading ? "Executing..." : "Execute Custom SQL"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {result && !schema && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? 
                  <CheckCircle2 className="h-4 w-4" /> : 
                  <XCircle className="h-4 w-4" />}
                <AlertTitle>
                  {result.success ? "Operation Successful" : "Operation Failed"}
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Message:</strong> {result.message}
                    </div>
                    {result.error && (
                      <div>
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                    {result.details && (
                      <div>
                        <strong>Details:</strong> {JSON.stringify(result.details, null, 2)}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Profile Management</CardTitle>
            <CardDescription>
              Manage user profiles in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you're already signed in but your profile doesn't appear in the database,
              click the button below to manually create a profile for your user.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/api/create-profile">
                Create My Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}