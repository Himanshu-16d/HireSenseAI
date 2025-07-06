// Vercel environment configuration
// This file helps with environment variable validation and defaults

export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '60000'),
  },
  
  // NextAuth
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    trustHost: true, // Required for Vercel
  },
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  
  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL,
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  },
  
  // AI Configuration
  ai: {
    nvidia: {
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    },
  },
  
  // Migration
  migration: {
    secret: process.env.MIGRATION_SECRET,
  },
}

// Validation for required environment variables
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  // Validate DATABASE_URL format
  if (config.database.url && !config.database.url.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
  }
  
  // Validate NEXTAUTH_SECRET length
  if (config.auth.secret && config.auth.secret.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long')
  }
  
  return true
}

// Runtime environment checks
export function getEnvironmentInfo() {
  return {
    isVercel: !!process.env.VERCEL,
    isProduction: config.app.isProduction,
    nodeVersion: process.version,
    region: process.env.VERCEL_REGION || 'unknown',
    deployment: process.env.VERCEL_URL || 'local',
  }
}
