# Smart Email Manager

An intelligent email management system powered by Claude AI.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS & shadcn/ui
- Supabase database integration
- NextAuth authentication with Google
- Claude AI API integration (coming soon)
- Email service integration (coming soon)

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env.local` file:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Next Auth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Email Service Configuration (Nylas or EmailEngine)
   EMAIL_SERVICE_API_KEY=
   EMAIL_SERVICE_CLIENT_ID=
   EMAIL_SERVICE_CLIENT_SECRET=

   # Claude API Configuration
   CLAUDE_API_KEY=
   ```
4. Set up your Supabase database:
   - Create a new project at https://supabase.com
   - Get your project URL and API keys from the dashboard
   - Run the database schema to create the tables and policies
5. Set up Google OAuth:
   - Create a project in the Google Cloud Console
   - Configure the OAuth consent screen
   - Create OAuth credentials (Web application type)
   - Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
6. Start the development server:
   ```bash
   npm run dev
   ```

## Implementation Progress

- [x] Phase 1.1: Project Initialization
- [x] Phase 1.2: Environment Configuration
- [x] Phase 1.3: Supabase Setup
- [x] Phase 1.4: User Authentication
- [ ] Phase 2: Database Schema
- [ ] Phase 3: Email Service Integration
- [ ] Phase 4: Claude API Integration
- [ ] Phase 5: Core API Routes
- [ ] Phase 6: Frontend Dashboard
- [ ] Phase 7: Email Cleanup Features
- [ ] Phase 8: Polish and Testing

## License

This project is for demonstration purposes only.