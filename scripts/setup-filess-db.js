/**
 * Database setup script for Filess.io
 * This script connects to the database and creates all required tables
 */

import { Client } from 'pg'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

const setupSQL = `
-- Create tables for NextAuth.js
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "password" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" TEXT DEFAULT 'candidate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
`

const setupConstraints = `
-- Add foreign key constraints
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
`

const setupAdminUser = `
-- Insert a test admin user (password: admin123)
INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
VALUES ('admin-test-id', 'Admin User', 'admin@hiresense.ai', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
VALUES ('admin-account-id', 'admin-test-id', 'credentials', 'credentials', 'admin@hiresense.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBG7Q6d16P9.6.')
ON CONFLICT ("provider", "providerAccountId") DO NOTHING;
`

async function setupDatabase() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['public']
  })

  try {
    console.log('🗄️  Setting up HireSenseAI database on Filess.io...')
    
    // Connect to database
    console.log('📡 Connecting to database...')
    await client.connect()
    console.log('✅ Database connection successful!')

    // Set schema
    console.log('🔧 Setting up schema...')
    await client.query('CREATE SCHEMA IF NOT EXISTS "HireSenseAI_comeballwe";')
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    console.log('✅ Schema set successfully!')

    // Create tables
    console.log('🏗️  Creating database tables...')
    await client.query(setupSQL)
    console.log('✅ Tables created successfully!')

    // Add constraints
    console.log('🔗 Adding foreign key constraints...')
    await client.query(setupConstraints)
    console.log('✅ Constraints added successfully!')

    // Create admin user
    console.log('👤 Creating test admin user...')
    await client.query(setupAdminUser)
    console.log('✅ Test admin user created!')

    // Show created tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'HireSenseAI_comeballwe' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📋 Created tables:')
    tablesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`)
    })

    console.log('\n🔑 Test Admin Credentials:')
    console.log('   Email: admin@hiresense.ai')
    console.log('   Password: admin123')
    
    console.log('\n⚠️  Remember to change the admin password after first login!')
    
    console.log('\n🚀 Next steps:')
    console.log('   1. Test your app locally: pnpm run dev')
    console.log('   2. Deploy to Vercel: pnpm run deploy:vercel')
    console.log('   3. Create your real admin user: pnpm run admin:create')

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the setup
setupDatabase()
