import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUserIfNotExists } from "@/lib/auth/user";

// Configuration for NextAuth
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          // Include mail scope for email access
          scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin", // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token right after sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        // Add additional user info to the session
        session.user.id = token.sub;
        
        // Add access token and other provider details to the session
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign-in attempt:", { 
        user: { id: user.id, email: user.email },
        account: account ? { provider: account.provider } : null 
      });
      
      if (!user.email) {
        console.error("User email missing");
        return false;
      }
      
      // Create or update user in Supabase
      try {
        console.log("Attempting to create/update user in Supabase");
        await createUserIfNotExists(user);
        console.log("User created/updated successfully");
      } catch (error) {
        console.error("Error creating user in Supabase:", error);
        // Continue anyway - don't block authentication
        console.log("Continuing despite Supabase error");
      }
      
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };