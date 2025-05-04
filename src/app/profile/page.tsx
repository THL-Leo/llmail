import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, MailIcon, KeyIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }
  
  const user = session.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";
  
  // Get Supabase profile if available
  let supabaseProfile = null;
  let supabaseError = null;
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (data) {
      supabaseProfile = data;
    }
    
    if (error) {
      supabaseError = error.message;
    }
  } catch (error) {
    supabaseError = "Error fetching profile from Supabase";
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                User Information
              </CardTitle>
              <CardDescription>
                Your personal information from Google
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Details about your Smart Email Manager account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-sm text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Authentication Provider</p>
                  <p className="text-sm text-muted-foreground">Google</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Profile in Database</p>
                  <div className="flex items-center gap-2">
                    {supabaseProfile ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <p className="text-sm text-green-500">Profile exists in Supabase</p>
                      </>
                    ) : (
                      <>
                        <KeyIcon className="h-4 w-4 text-amber-500" />
                        <p className="text-sm text-amber-500">
                          {supabaseError ? `Error: ${supabaseError}` : "Profile not found in Supabase"}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          asChild
                        >
                          <Link href="/api/create-profile">Create Profile Manually</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {supabaseProfile && (
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(supabaseProfile.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/test">
                <Button variant="outline" size="sm">Database Setup</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Details about your authentication and tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Access Token</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {session.accessToken ? 
                      `${session.accessToken.substring(0, 20)}...` : 
                      "No access token found"}
                  </p>
                </div>
                {session.accessToken && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                      Authentication successful! You are now signed in.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/signout">
                <Button variant="destructive" size="sm">Sign Out</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}