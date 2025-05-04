"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { DatabaseIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<null | { success: boolean; message: string; profilesTableExists?: boolean }>(null);
  const [setupResult, setSetupResult] = useState<null | { success: boolean; message: string }>(null);
  
  const checkDbStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch (error) {
      setDbStatus({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  const setupDb = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/setup-db");
      const data = await res.json();
      setSetupResult(data);
      
      // Re-check status after setup
      await checkDbStatus();
    } catch (error) {
      setSetupResult({ success: false, message: (error as Error).message });
    }
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-8 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Database Setup</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-center">
            This page helps you set up the database for Smart Email Manager
          </p>
          
          <Separator className="w-1/2 my-6" />
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5 text-primary" />
                Database Status
              </CardTitle>
              <CardDescription>
                Check the current status of your Supabase database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dbStatus ? (
                <Alert variant={dbStatus.success ? "default" : "destructive"}>
                  {dbStatus.success ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                  <AlertTitle>{dbStatus.success ? "Connected" : "Connection Error"}</AlertTitle>
                  <AlertDescription>
                    {dbStatus.message}
                    {dbStatus.profilesTableExists !== undefined && (
                      <div className="mt-2">
                        <strong>Profiles table:</strong> {dbStatus.profilesTableExists ? "Exists" : "Missing"}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-muted-foreground">Click the button below to check database status</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled={loading} onClick={checkDbStatus}>
                {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <RefreshCwIcon className="h-4 w-4 mr-2" />}
                Check Status
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5 text-primary" />
                Initialize Database
              </CardTitle>
              <CardDescription>
                Create required tables and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {setupResult ? (
                <Alert variant={setupResult.success ? "default" : "destructive"}>
                  {setupResult.success ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                  <AlertTitle>{setupResult.success ? "Setup Complete" : "Setup Error"}</AlertTitle>
                  <AlertDescription>
                    {setupResult.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click the button below to initialize the database with the required tables and policies.
                  This will create the profiles table needed for user authentication.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="default"
                disabled={loading}
                onClick={setupDb}
              >
                {loading ? <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" /> : <DatabaseIcon className="h-4 w-4 mr-2" />}
                Initialize Database
              </Button>
            </CardFooter>
          </Card>
          
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
    </div>
  );
}