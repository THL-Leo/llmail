"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, RefreshCwIcon, HomeIcon, CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [directResult, setDirectResult] = useState<any>(null);
  const [clientResult, setClientResult] = useState<any>(null);
  const [dbStatusResult, setDbStatusResult] = useState<any>(null);
  const [adminResult, setAdminResult] = useState<any>(null);
  
  const testDirectConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/supabase-direct");
      const data = await res.json();
      setDirectResult(data);
    } catch (error) {
      setDirectResult({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  const testClientConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/supabase-test");
      const data = await res.json();
      setClientResult(data);
    } catch (error) {
      setClientResult({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  const testDbStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatusResult(data);
    } catch (error) {
      setDbStatusResult({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  const runAdminSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-setup");
      const data = await res.json();
      setAdminResult(data);
    } catch (error) {
      setAdminResult({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-8 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Supabase Connection Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-center">
            This page helps troubleshoot Supabase connection issues
          </p>
          
          <Separator className="w-1/2 my-6" />
        </div>
        
        <Tabs defaultValue="direct">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="direct">Direct API Test</TabsTrigger>
            <TabsTrigger value="client">Client Test</TabsTrigger>
            <TabsTrigger value="db">DB Status</TabsTrigger>
            <TabsTrigger value="admin">Admin Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  Direct API Connection Test
                </CardTitle>
                <CardDescription>
                  Test connection to Supabase API directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                {directResult ? (
                  <Alert variant={directResult.success ? "default" : "destructive"}>
                    {directResult.success ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                    <AlertTitle>
                      {directResult.success ? "Connection Successful" : "Connection Failed"}
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <div className="space-y-2">
                        <div>
                          <strong>Status:</strong> {directResult.status} {directResult.statusText}
                        </div>
                        {directResult.url && (
                          <div>
                            <strong>URL:</strong> {directResult.url}
                          </div>
                        )}
                        {directResult.env && (
                          <div>
                            <strong>Credentials:</strong>
                            <div className="pl-4 pt-1">
                              <div>URL: {directResult.env.NEXT_PUBLIC_SUPABASE_URL}</div>
                              <div>Key: {directResult.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}</div>
                            </div>
                          </div>
                        )}
                        {directResult.text && (
                          <div>
                            <strong>Response:</strong>
                            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                              {directResult.text}
                            </pre>
                          </div>
                        )}
                        {directResult.error && (
                          <div>
                            <strong>Error:</strong> {directResult.error}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click the button below to test the direct API connection to Supabase.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="default" disabled={loading} onClick={testDirectConnection}>
                  {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <RefreshCwIcon className="h-4 w-4 mr-2" />}
                  Test Direct Connection
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="client" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  Supabase Client Test
                </CardTitle>
                <CardDescription>
                  Test connection using the Supabase client
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientResult ? (
                  <Alert variant={clientResult.success ? "default" : "destructive"}>
                    {clientResult.success ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                    <AlertTitle>
                      {clientResult.success ? "Connection Successful" : "Connection Failed"}
                    </AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Message:</strong> {clientResult.message}
                        </div>
                        {clientResult.error && (
                          <div>
                            <strong>Error:</strong> {clientResult.error}
                          </div>
                        )}
                        {clientResult.authenticated !== undefined && (
                          <div>
                            <strong>Authenticated:</strong> {clientResult.authenticated ? "Yes" : "No"}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click the button below to test the Supabase client connection.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="default" disabled={loading} onClick={testClientConnection}>
                  {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <RefreshCwIcon className="h-4 w-4 mr-2" />}
                  Test Client Connection
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="db" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  Database Status
                </CardTitle>
                <CardDescription>
                  Check database tables and connection
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dbStatusResult ? (
                  <Alert variant={dbStatusResult.success ? "default" : "destructive"}>
                    {dbStatusResult.success ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                    <AlertTitle>
                      {dbStatusResult.success ? "Status Check Successful" : "Status Check Failed"}
                    </AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Message:</strong> {dbStatusResult.message}
                        </div>
                        {dbStatusResult.connection && (
                          <div>
                            <strong>Connection:</strong> {dbStatusResult.connection}
                          </div>
                        )}
                        {dbStatusResult.tables && (
                          <div>
                            <strong>Tables:</strong>
                            <div className="pl-4 pt-1">
                              {dbStatusResult.tables.length === 0 ? (
                                <span>No tables found</span>
                              ) : (
                                dbStatusResult.tables.map((table: string, index: number) => (
                                  <div key={index}>{table}</div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                        {dbStatusResult.profilesTableExists !== undefined && (
                          <div>
                            <strong>Profiles table:</strong> {dbStatusResult.profilesTableExists ? "Exists" : "Missing"}
                          </div>
                        )}
                        {dbStatusResult.error && (
                          <div>
                            <strong>Error:</strong> {dbStatusResult.error}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click the button below to check the database status.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="default" disabled={loading} onClick={testDbStatus}>
                  {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <RefreshCwIcon className="h-4 w-4 mr-2" />}
                  Check DB Status
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  Admin Database Setup
                </CardTitle>
                <CardDescription>
                  Set up the database tables using admin privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminResult ? (
                  <Alert variant={adminResult.success ? "default" : "destructive"}>
                    {adminResult.success ? <CheckIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                    <AlertTitle>
                      {adminResult.success ? "Setup Successful" : "Setup Failed"}
                    </AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <div>
                          <strong>Message:</strong> {adminResult.message}
                        </div>
                        
                        {adminResult.results && (
                          <div>
                            <strong>Results:</strong>
                            <div className="pl-4 pt-1">
                              {adminResult.results.map((result: any, index: number) => (
                                <div key={index} className={result.success ? "text-green-500" : "text-red-500"}>
                                  {result.operation}: {result.success ? "Success" : "Failed"}
                                  {result.error && <span> - {result.error}</span>}
                                  {result.note && <div className="text-sm text-muted-foreground">{result.note}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {adminResult.manualSQL && (
                          <div>
                            <strong>Manual SQL to run:</strong>
                            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                              {adminResult.manualSQL}
                            </pre>
                          </div>
                        )}
                        
                        {adminResult.error && (
                          <div>
                            <strong>Error:</strong> {adminResult.error}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click the button below to set up the database tables using admin privileges (service role key).
                    This will create the profiles table needed for user authentication.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="default" disabled={loading} onClick={runAdminSetup}>
                  {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <RefreshCwIcon className="h-4 w-4 mr-2" />}
                  Run Admin Setup
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <HomeIcon className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}