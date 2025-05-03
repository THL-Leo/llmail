# Claude Code Incremental Build Guide

## Smart Email Manager Hackathon Project

This guide provides a step-by-step approach to building the Smart Email Manager project incrementally. Each feature is broken down into small, manageable tasks to ensure a successful implementation within the 24-hour hackathon timeframe.

---

## Core Development Philosophy
- Build one feature at a time
- Test each component before moving on
- Prioritize core functionality first
- Create a working prototype before adding enhancements

---

## Incremental Build Process

### Phase 1: Project Setup & Authentication (3 hours)

#### 1.1: Initialize Project (30 min)
```bash
# Start with initializing the Next.js project
npx create-next-app@latest smart-email-manager --typescript --eslint --tailwind --app
cd smart-email-manager

# Install core dependencies
npm install @supabase/supabase-js next-auth @anthropic-ai/sdk axios
```

#### 1.2: Environment Configuration (15 min)
- Create `.env.local` and `.env.example` files
- Set up base environment variables
- Validate environment variables are loaded correctly

#### 1.3: Supabase Setup (45 min)
- Create a new Supabase project
- Add the Supabase URL and keys to environment variables
- Create database client utility
- Test database connection

#### 1.4: User Authentication (90 min)
- Implement NextAuth with Google provider
- Create sign-in and sign-out pages
- Set up user session management
- Create user profile in Supabase on sign-in
- Test authentication flow

```javascript
// Validate Phase 1
console.log("✅ Project initialized");
console.log("✅ Environment configured");
console.log("✅ Supabase connected");
console.log("✅ Authentication working");
```

### Phase 2: Database Schema (1 hour)

#### 2.1: Create Base Tables (30 min)
- Execute SQL to create users table
- Create email_accounts table
- Create emails table
- Create email_classifications table

#### 2.2: Security Policies (15 min)
- Enable Row Level Security
- Create appropriate policies for each table
- Test policies with different user contexts

#### 2.3: Database Utility Functions (15 min)
- Create helper functions for database operations
- Implement error handling
- Test database operations

```javascript
// Validate Phase 2
const { data, error } = await supabase.from('users').select('*');
console.log("✅ Database schema created");
console.log("✅ RLS policies applied");
console.log("✅ Database utilities working");
```

### Phase 3: Email Service Integration (4 hours)

#### 3.1: Service Selection and Setup (30 min)
- Evaluate Nylas vs EmailEngine
- Set up developer account
- Add API keys to environment variables

#### 3.2: Email Account Connection (90 min)
- Create email connection form component
- Implement OAuth flow for Gmail
- Store account credentials securely
- Test connection with a real account

#### 3.3: Email Fetching (60 min)
- Create email service utility
- Implement email fetching functionality
- Store emails in Supabase
- Handle pagination and limits

#### 3.4: Basic Email Display (60 min)
- Create simple email list component
- Display basic email information
- Implement loading states
- Test with real email data

```javascript
// Validate Phase 3
const emails = await getEmails(accountId);
console.log(`✅ Retrieved ${emails.length} emails`);
console.log("✅ Email service integrated");
console.log("✅ Email data stored in database");
console.log("✅ Basic email display working");
```

### Phase 4: Claude API Integration (3 hours)

#### 4.1: Claude API Setup (30 min)
- Add Claude API key to environment variables
- Create Claude API utility
- Test basic API connection

#### 4.2: Email Classification Prompt (45 min)
- Design classification prompt
- Test with sample emails
- Refine prompt based on results
- Implement error handling

#### 4.3: Classification Storage (45 min)
- Store classification results in database
- Link classifications to emails
- Implement batch classification
- Add classification update functionality

#### 4.4: Importance Scoring Logic (60 min)
- Implement dynamic threshold calculation
- Create importance score visualization
- Test with various email types
- Validate career opportunity detection

```javascript
// Validate Phase 4
const classification = await classifyEmail(sampleEmail);
console.log("✅ Claude API connected");
console.log("✅ Email classification working");
console.log("✅ Classification storage implemented");
console.log("✅ Importance scoring logic working");
```

### Phase 5: Core API Routes (3 hours)

#### 5.1: Email Account Routes (45 min)
- Create routes for managing email accounts
- Implement CRUD operations
- Add authentication checks
- Test with real accounts

#### 5.2: Email Fetching Routes (45 min)
- Create routes for fetching emails
- Implement filtering and pagination
- Add caching for performance
- Test with various queries

#### 5.3: Email Classification Routes (45 min)
- Create routes for classifying emails
- Implement batch classification
- Add manual classification override
- Test classification accuracy

#### 5.4: Email Action Routes (45 min)
- Create routes for email actions (archive, review)
- Implement batch actions
- Add success/error handling
- Test with real emails

```javascript
// Validate Phase 5
const response = await fetch('/api/email?limit=10');
const data = await response.json();
console.log("✅ Email account routes working");
console.log("✅ Email fetching routes working");
console.log("✅ Classification routes working");
console.log("✅ Action routes working");
```

### Phase 6: Frontend Dashboard (4 hours)

#### 6.1: Dashboard Layout (60 min)
- Create responsive dashboard layout
- Implement sidebar for email accounts
- Add main content area for emails
- Create loading states

#### 6.2: Email Account List (45 min)
- Create email account list component
- Display account information
- Add account selection functionality
- Show account connection status

#### 6.3: Email Category Visualization (45 min)
- Create email category chart
- Display importance distribution
- Add interactive filtering
- Implement responsive design

#### 6.4: Important Emails Display (45 min)
- Create important emails list
- Show classification information
- Add actions (archive, reply)
- Implement pagination

#### 6.5: Cleanup Suggestions (45 min)
- Create cleanup suggestions component
- Group by sender
- Implement batch actions
- Add confirmation dialogs

```javascript
// Validate Phase 6
console.log("✅ Dashboard layout implemented");
console.log("✅ Email account list working");
console.log("✅ Category visualization working");
console.log("✅ Important emails display working");
console.log("✅ Cleanup suggestions working");
```

### Phase 7: Email Cleanup Features (3 hours)

#### 7.1: Low Priority Email Detection (45 min)
- Implement dynamic threshold calculation
- Create low priority email query
- Test with various account sizes
- Validate accuracy

#### 7.2: Email Grouping (45 min)
- Group emails by sender
- Create group statistics
- Implement group actions
- Test with real data

#### 7.3: Review Folder (45 min)
- Create review folder functionality
- Implement move to review action
- Add review interface
- Test with real emails

#### 7.4: Batch Actions (45 min)
- Implement batch archive
- Add batch delete
- Create batch move to folder
- Test with large email sets

```javascript
// Validate Phase 7
const suggestions = await getCleanupSuggestions();
console.log("✅ Low priority detection working");
console.log("✅ Email grouping implemented");
console.log("✅ Review folder working");
console.log("✅ Batch actions working");
```

### Phase 8: Polish and Testing (3 hours)

#### 8.1: UI Refinement (60 min)
- Improve component styling
- Add animations and transitions
- Ensure mobile responsiveness
- Fix any UI inconsistencies

#### 8.2: Performance Optimization (45 min)
- Implement caching
- Add virtualized lists for large data
- Optimize API calls
- Measure and improve load times

#### 8.3: Error Handling (45 min)
- Add global error handling
- Implement user-friendly error messages
- Create fallback UI components
- Test error scenarios

#### 8.4: Final Testing (30 min)
- Test entire application flow
- Verify all features work together
- Fix any remaining issues
- Prepare for demonstration

```javascript
// Validate Phase 8
console.log("✅ UI refinements complete");
console.log("✅ Performance optimized");
console.log("✅ Error handling implemented");
console.log("✅ Final testing complete");
```

---

## Quick Reference: Key Integration Points

### Email Service (Nylas) Integration
```javascript
// Key endpoints
const NYLAS_API = 'https://api.nylas.com';

// Authentication flow
// 1. Redirect user to Nylas auth URL
// 2. Handle callback with auth code
// 3. Exchange code for tokens
// 4. Store tokens in database
```

### Claude API Integration
```javascript
// Sample classification prompt
const prompt = `
  You are an AI assistant analyzing emails to determine their importance and category.
  
  EMAIL:
  From: ${email.from}
  Subject: ${email.subject}
  Date: ${email.date}
  Body: ${email.body}
  
  Assign an importance score (0-100) and categorize.
  Format as JSON: {"importance_score": number, "category": string, "reason": string, "can_archive": boolean}
`;
```

### Dynamic Threshold Calculation
```javascript
function getDynamicThreshold(emailCount) {
  if (emailCount < 100) return 30;
  if (emailCount < 1000) return 40;
  return 50;
}
```

---

## Validation Checkpoints

At each phase completion, verify:
1. Does the implementation match the requirements?
2. Are there any errors or bugs?
3. Is the code clean and maintainable?
4. Does it perform well with real data?
5. Is it ready for the next phase?

---

## Troubleshooting Common Issues

### Authentication Failures
- Verify OAuth configuration
- Check for expired tokens
- Validate CORS settings

### Email Service Issues
- Check API rate limits
- Verify correct scopes
- Test with multiple providers

### Claude API Problems
- Validate API key
- Check prompt formatting
- Handle rate limiting

### Database Errors
- Verify schema compatibility
- Check connection settings
- Validate transactions

---

## Extension Ideas (If Time Permits)

1. Email summary generation
2. Smart reply suggestions
3. Calendar integration
4. Batch processing of similar emails
5. Email sentiment analysis

Remember: Focus on completing core functionality before adding extensions!