import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, MailIcon, CheckCircleIcon, ArrowRightIcon, DatabaseIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center space-y-8 mb-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Smart Email Manager</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Intelligent email management powered by Claude AI
          </p>
        </div>
        
        <Separator className="w-1/2 my-6" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-primary" />
              Environment Status
            </CardTitle>
            <CardDescription>
              Check your setup and configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Configuration Check</AlertTitle>
              <AlertDescription>
                Make sure to set up all required environment variables in your .env.local file
                before proceeding with further implementation.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Environment Config</span>
                <Badge variant="secondary">
                  <Link href="/api/env-test">Check</Link>
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Supabase Connection</span>
                <Badge variant="secondary">
                  <Link href="/api/supabase-test">Check</Link>
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/api/env-test" passHref>
              <Button variant="secondary">Check Environment</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-primary" />
              Smart Email Features
            </CardTitle>
            <CardDescription>
              Manage your emails intelligently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Classification</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Importance Scoring</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cleanup Suggestions</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Actions</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled>Explore Features</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Implementation Progress</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Phase 1.1: Project Initialization</p>
                  <p className="text-sm text-muted-foreground">Next.js project with TypeScript, Tailwind CSS, and App Router</p>
                </div>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Phase 1.2: Environment Configuration</p>
                  <p className="text-sm text-muted-foreground">Environment variables and validation setup</p>
                </div>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Phase 1.3: Supabase Setup</p>
                  <p className="text-sm text-muted-foreground">Create Supabase project and database client</p>
                </div>
                <Badge className="bg-green-500">Complete</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border border-zinc-200 flex items-center justify-center">
                  <span className="text-xs">4</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Phase 1.4: User Authentication</p>
                  <p className="text-sm text-muted-foreground">Implement NextAuth with Google provider</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5 text-primary" />
              Database Schema
            </CardTitle>
            <CardDescription>
              Supabase database tables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>profiles</span>
                <Badge>User profiles</Badge>
              </li>
              <li className="flex justify-between">
                <span>email_accounts</span>
                <Badge>Connected accounts</Badge>
              </li>
              <li className="flex justify-between">
                <span>emails</span>
                <Badge>Email metadata</Badge>
              </li>
              <li className="flex justify-between">
                <span>email_classifications</span>
                <Badge>AI analysis</Badge>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" size="sm" asChild>
              <Link href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                Open Supabase Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Continue with authentication setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Implement NextAuth with Google provider</li>
              <li>Create sign-in and sign-out pages</li>
              <li>Set up user session management</li>
              <li>Create user profile in Supabase on sign-in</li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button className="gap-2">
              Continue to Next Phase
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>Smart Email Manager &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}