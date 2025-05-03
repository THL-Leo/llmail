/**
 * Utility to validate environment variables
 */

// Required environment variables for the application
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const;

// Optional environment variables that are not required for initial setup
const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'EMAIL_SERVICE_API_KEY',
  'EMAIL_SERVICE_CLIENT_ID',
  'EMAIL_SERVICE_CLIENT_SECRET',
  'CLAUDE_API_KEY',
  'NEXT_PUBLIC_BASE_URL',
] as const;

// All environment variables
const allEnvVars = [...requiredEnvVars, ...optionalEnvVars] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar = typeof optionalEnvVars[number];
type EnvVar = typeof allEnvVars[number];

// Validate all required environment variables
export function validateEnv(): { valid: boolean; missing: RequiredEnvVar[] } {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key] === ''
  );
  
  return { 
    valid: missing.length === 0, 
    missing 
  };
}

// Get environment variable with type safety
export function getEnv(key: RequiredEnvVar): string;
export function getEnv(key: OptionalEnvVar, defaultValue: string): string;
export function getEnv(key: EnvVar, defaultValue?: string): string {
  const value = process.env[key];
  
  if (!value && defaultValue !== undefined) {
    return defaultValue;
  }
  
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

// Log environment validation on startup (to be used in a server context)
export function logEnvValidation(): void {
  const { valid, missing } = validateEnv();
  
  if (!valid) {
    console.warn('⚠️ Missing required environment variables:');
    missing.forEach((key) => console.warn(`  - ${key}`));
    console.warn('Application may not function correctly.');
  } else {
    console.log('✅ Environment configuration validated');
  }
}