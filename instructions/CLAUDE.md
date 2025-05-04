# Claude Code Incremental Build Guide

## Smart Email Manager Hackathon Project

This guide provides a step-by-step approach to building the Smart Email Manager project incrementally. Each feature is broken down into small, manageable tasks to ensure a successful implementation within the 24-hour hackathon timeframe.

**Key Technologies:**
- Next.js with App Router
- Supabase for database
- Claude API for email intelligence
- Gmail API for email integration
- shadcn/ui for beautiful, accessible UI components

---

## Core Development Philosophy
- Build one feature at a time
- Test each component before moving on
- Prioritize core functionality first
- Create a working prototype before adding enhancements

---

## Incremental Build Process

### Phase 1: Project Setup & Authentication (3 hours)

#### 1.1: Initialize Project (45 min)
```bash
# Start with initializing the Next.js project
npx create-next-app@latest smart-email-manager --typescript --eslint --tailwind --app
cd smart-email-manager

# Install core dependencies
npm install @supabase/supabase-js next-auth @anthropic-ai/sdk axios

# Install shadcn/ui
npx shadcn-ui@latest init

# Select the following options:
# - Would you like to use TypeScript? Yes
# - Which style would you like to use? Default
# - Which color would you like to use as base color? Slate
# - Where is your global CSS file? app/globals.css
# - Do you want to use CSS variables for colors? Yes
# - Are you using a custom tailwind prefix? No
# - Where is your tailwind.config.js located? tailwind.config.js
# - Configure the import alias for components? @/components
# - Configure the import alias for utils? @/lib/utils
# - Are you using React Server Components? Yes
# - Install dependencies? Yes

# Add commonly used components
npx shadcn-ui@latest add button card dialog dropdown-menu avatar alert toast input tabs table popover form
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

### Phase 6: Frontend Dashboard with shadcn/ui (4 hours)

#### 6.1: Dashboard Layout with shadcn Components (60 min)
- Create responsive dashboard layout using shadcn/ui components
- Implement sidebar using Card component
- Create tabbed interface with Tabs component
- Use Skeleton component for loading states
- Add responsive styling with Tailwind CSS

#### 6.2: Email Account List Component (45 min)
- Build email account list using shadcn/ui Card and Avatar components
- Use DropdownMenu for account options
- Implement active state with shadcn Button variants
- Add connection status with shadcn Badge component

#### 6.3: Email Category Visualization (45 min)
- Create email category chart using shadcn/ui Card for container
- Implement importance distribution with custom chart
- Add interactive filtering with shadcn/ui ToggleGroup
- Ensure responsive behavior on all devices

#### 6.4: Important Emails Display (45 min)
- Build important emails list with shadcn/ui Table component
- Use shadcn/ui Card for email preview
- Implement actions with DropdownMenu component
- Add hover states and animations
- Use shadcn/ui pagination component

#### 6.5: Cleanup Suggestions UI (45 min)
- Create cleanup suggestions using shadcn/ui Accordion
- Group by sender with nested Cards
- Implement batch actions with shadcn/ui ButtonGroup
- Use shadcn/ui Dialog for confirmation modals
- Add shadcn/ui Toast for action feedback

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

#### 8.1: UI Refinement with shadcn (60 min)
- Add shadcn/ui Tooltip components for better UX
- Implement shadcn/ui theme switching (light/dark mode)
- Enhance UI with shadcn/ui animations and transitions
- Use shadcn HoverCard for email previews
- Ensure consistent spacing and typography using shadcn conventions

#### 8.2: Performance Optimization (45 min)
- Implement React Query for caching
- Add virtualized lists for large email datasets
- Optimize API calls and reduce unnecessary rerenders
- Measure and improve load times
- Use shadcn/ui Skeleton components for loading states

#### 8.3: Error Handling with shadcn/ui (45 min)
- Add global error handling
- Use shadcn/ui Alert components for error messages
- Implement shadcn/ui Toast for notifications
- Create fallback UI components with shadcn/ui
- Test error scenarios with meaningful feedback

#### 8.4: Final Testing (30 min)
- Test entire application flow
- Verify all features work together
- Fix any remaining UI inconsistencies
- Prepare for demonstration
- Create demo account with sample data

```javascript
// Validate Phase 8
console.log("✅ UI refinements complete");
console.log("✅ Performance optimized");
console.log("✅ Error handling implemented");
console.log("✅ Final testing complete");
```

---

## Quick Reference: Key Integration Points

### Gmail API Integration
```javascript
// Key imports for Gmail API
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Authentication flow
// 1. Create OAuth2 client
// 2. Generate authorization URL
// 3. Redirect user to auth URL
// 4. Handle callback and get tokens
// 5. Store tokens in Supabase

// Sample Gmail API code
async function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  
  try {
    const response = await gmail.users.labels.list({
      userId: 'me',
    });
    
    return response.data.labels;
  } catch (error) {
    console.error('Error fetching labels:', error);
    throw error;
  }
}

async function listMessages(auth, query = '', maxResults = 10) {
  const gmail = google.gmail({ version: 'v1', auth });
  
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: maxResults,
    });
    
    return response.data.messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}
```

### shadcn/ui Component Usage

```javascript
// Component import pattern
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Example component with shadcn
export function EmailCard({ email }) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{email.subject}</CardTitle>
        <CardDescription>{email.from_name} ({email.from_address})</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{email.preview}</p>
        <div className="mt-2 flex items-center">
          <Badge variant={email.importance_score > 70 ? "destructive" : 
                         email.importance_score > 40 ? "default" : "secondary"}>
            {email.category}
          </Badge>
          <span className="ml-2 text-xs text-gray-500">
            {new Date(email.received_at).toLocaleString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">Archive</Button>
        <Button size="sm">View</Button>
      </CardFooter>
    </Card>
  )
}
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
- Verify Google Cloud project is set up correctly
- Check that Gmail API is enabled
- Confirm OAuth consent screen configuration
- Ensure correct scopes are requested
- Verify redirect URIs match exactly

### Gmail API Issues
- Check token expiration and refresh logic
- Ensure API usage is within quota limits
- Verify user has granted necessary permissions
- Handle rate limiting properly
- Monitor API responses for error codes

### Claude API Problems
- Validate API key
- Check prompt formatting
- Handle rate limiting

### Database Errors
- Verify schema compatibility
- Check connection settings
- Validate transactions

---

## shadcn/ui Theme Customization

For a cohesive and branded look:

```javascript
// In globals.css, customize the shadcn theme
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Add custom colors for email categories */
  --urgent: 0 84.2% 60.2%;
  --career: 142.1 76.2% 36.3%;
  --financial: 43.3 96.4% 56.3%;
  --low-priority: 217.2 32.6% 17.5%;
}

/* Add dark mode variant */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  /* Continue with dark mode variables */
}
```

## Component Library Reference

Key shadcn/ui components for this project:

1. **Layout Components**
   - Card: Email containers, account list items
   - Tabs: Dashboard sections
   - Sheet: Mobile sidebar

2. **Input Components**
   - Button: Actions
   - Checkbox: Batch selections
   - Switch: Settings toggles

3. **Data Display**
   - Table: Email lists
   - Badge: Category/importance indicators
   - Avatar: Email sender icons

4. **Feedback Components**
   - Toast: Action confirmations
   - Alert: Warnings and notices
   - Dialog: Confirmations
   - Skeleton: Loading states

5. **Navigation**
   - DropdownMenu: Email actions
   - Pagination: Email list navigation

---

## Extension Ideas (If Time Permits)

1. Email summary generation with shadcn/ui Collapsible
2. Smart reply suggestions using shadcn/ui Command
3. Calendar integration with shadcn/ui Calendar
4. Batch processing UI with shadcn/ui DataTable
5. Email sentiment visualization with custom components

Remember: Focus on completing core functionality before adding extensions!