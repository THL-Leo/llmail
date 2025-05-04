"use client";

import { useSession, signOut, signIn } from "next-auth/react";

/**
 * Custom hook for handling authentication
 * Provides convenient access to session data and auth functions
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;
  
  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user,
    signIn: (provider: string) => signIn(provider),
    signOut: () => signOut(),
  };
}