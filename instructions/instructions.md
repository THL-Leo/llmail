# Claude Code Rules File

## Project: Smart Email Manager

### Project Overview
This project is a Smart Email Manager that uses Next.js and Supabase to create an intelligent email management system. The system integrates with email providers, classifies emails using the Claude API, and provides cleanup suggestions.

### Development Approach
- Work incrementally, building one component at a time
- Validate each component before moving to the next
- Use modern JavaScript/TypeScript practices
- Follow the project structure outlined in the implementation plan

### Primary Technologies
- Next.js (App Router)
- Supabase
- Claude API
- Nylas (or EmailEngine) for email integration
- NextAuth for authentication
- Tailwind CSS for styling

### Development Sequence
1. Project initialization and environment setup
2. Database schema creation
3. Authentication implementation
4. Email service integration
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
- Create reusable components
- Use Tailwind CSS for styling
- Implement responsive design for all screen sizes
- Handle loading and error states gracefully
- Provide user feedback for all actions

### Authentication Guidelines
- Use NextAuth for authentication
- Implement OAuth flows for email providers
- Secure API routes with session validation
- Store tokens securely

### Claude API Integration Guidelines
- Use the claude-3-sonnet-20240229 model
- Keep prompts concise and focused
- Implement rate limiting and error handling
- Cache results where appropriate

### Email Service Integration Guidelines
- Use Nylas or EmailEngine for email integration
- Implement OAuth flows for email providers
- Cache email data in Supabase
- Implement webhook handlers for real-time updates

### Incremental Development Steps
1. Set up project structure and dependencies
2. Create Supabase tables and policies
3. Implement authentication
4. Create basic email service integration
5. Implement Claude API integration
6. Create API routes for email operations
7. Build dashboard page and components
8. Implement cleanup suggestions
9. Add email actions (archive, review)
10. Test and optimize
11. Deploy

### Testing Guidelines
- Test authentication flows
- Verify email fetching and classification
- Test cleanup suggestion algorithms
- Validate email actions (archive, review)
- Test with multiple email providers

### Deployment Guidelines
- Use Vercel for deployment
- Set up environment variables
- Configure Supabase for production
- Set up monitoring and error tracking

### Extension Ideas (if time permits)
- Email summary generation
- Smart reply suggestions
- Calendar integration
- Batch processing of similar emails
- Email sentiment analysis

Remember to work on one component at a time and ensure each is working correctly before moving to the next one.