"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export default function SignOut() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <LogOutIcon className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Sign Out</CardTitle>
          <CardDescription className="text-center">
            Are you sure you want to sign out of Smart Email Manager?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button 
              variant="destructive"
              className="w-full" 
              onClick={() => signOut({ callbackUrl: '/signin' })}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">
              Cancel
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}