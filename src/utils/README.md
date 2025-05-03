# Smart Email Manager Utilities

This directory contains utility functions and helpers for the Smart Email Manager application.

## Environment Configuration Utilities

The `env.ts` file provides functionality for:

1. Validating required environment variables
2. Accessing environment variables in a type-safe manner
3. Logging environment validation status

### Usage

```typescript
import { validateEnv, getEnv, logEnvValidation } from '@/utils/env';

// Check if all required environment variables are set
const { valid, missing } = validateEnv();
if (!valid) {
  console.error('Missing environment variables:', missing);
}

// Get environment variables in a type-safe way
const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const baseUrl = getEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'); // With default value

// Log environment validation status (for server-side only)
logEnvValidation();
```

## Phase 1.2 Completion

✅ Environment Configuration Completed:
- Created `.env.local` and `.env.example` files
- Set up base environment variables structure
- Created environment validation utilities
- Added API route to verify environment configuration
- Updated homepage to show environment status