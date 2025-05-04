import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Get the current user session on the server
 */
export async function getSession() {
  // This functionality is handled by the Next.js handler now
  // This is a wrapper for future extensions
  return await getServerSession();
}

/**
 * Check if the user is authenticated on the server
 * Redirects to sign-in page if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/signin");
  }
  
  return session;
}

/**
 * Get the current user's ID from the session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id as string || null;
}