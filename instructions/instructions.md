# Claude Code Rules File

## Project: Smart Email Manager

### Project Overview
This project is a Smart Email Manager that uses Next.js and Supabase to create an intelligent email management system. The system integrates with Gmail, classifies emails using the Claude API, and provides cleanup suggestions.

### Development Approach
- Work incrementally, building one component at a time
- Validate each component before moving to the next
- Use modern JavaScript/TypeScript practices
- Follow the project structure outlined in the implementation plan

### Primary Technologies
- Next.js (App Router)
- Supabase
- Claude API
- Gmail API for email integration
- NextAuth for authentication
- Tailwind CSS with shadcn/ui for styling

### Development Sequence
1. Project initialization and environment setup
2. Database schema creation
3. Authentication implementation
4. Gmail API integration
5. Claude API integration
6. API routes development
7. Frontend components
8. Testing and deployment

### Code Standards
- Use TypeScript where possible
- Implement error handling for all API calls
- Use async/await for asynchronous operations
- Follow React best practices (hooks, functional components)
- Add appropriate comments for complex logic
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for components)

### Database Guidelines
- Follow the schema defined in the implementation plan
- Implement appropriate Row Level Security policies
- Use foreign key constraints for data integrity
- Create indexes for frequently queried fields

### API Guidelines
- Implement proper error handling and status codes
- Return consistent JSON response formats
- Validate input data before processing
- Implement rate limiting for external API calls

### Frontend Guidelines
- Create reusable components with shadcn/ui
- Use shadcn/ui for styling
- Implement responsive design for all screen sizes
- Handle loading and error states gracefully
- Provide user feedback for all actions

### Authentication Guidelines
- Use NextAuth for user authentication to the application
- Implement Google OAuth for Gmail API authorization
- Secure API routes with session validation
- Store tokens securely in Supabase

### Claude API Integration Guidelines
- Use the claude-3-sonnet-20240229 model
- Keep prompts concise and focused
- Implement rate limiting and error handling
- Cache results where appropriate

### Gmail API Integration Guidelines
- Use the official googleapis package
- Implement proper OAuth2 authentication flow
- Store refresh tokens securely
- Handle token refresh logic
- Cache email data in Supabase
- Respect Gmail API quotas and rate limits

### Incremental Development Steps
1. Set up project structure and dependencies
2. Create Supabase tables and policies
3. Implement user authentication with NextAuth
4. Set up Google Cloud project and enable Gmail API
5. Create Gmail API OAuth flow
6. Implement Gmail API wrapper functions
7. Implement Claude API integration for email classification
8. Create API routes for Gmail operations
9. Build dashboard page and components
10. Implement cleanup suggestions
11. Add email actions (archive, label, review)
12. Test and optimize
13. Deploy

### Testing Guidelines
- Test user authentication flows
- Test Gmail API authorization flows
- Verify email fetching and classification
- Test cleanup suggestion algorithms
- Validate email actions (archive, label, review)

### Deployment Guidelines
- Use Vercel for deployment
- Set up environment variables
- Configure Supabase for production
- Set up monitoring and error tracking
- Configure proper OAuth redirect URIs for production

### Extension Ideas (if time permits)
- Email summary generation
- Smart reply suggestions
- Gmail label management
- Thread-based email organization
- Email sentiment analysis

Remember to work on one component at a time and ensure each is working correctly before moving to the next one.