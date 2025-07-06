#!/bin/bash

# HireSenseAI Database Setup Script for Filess.io
# This script connects to your Filess.io database and sets up all required tables

echo "🗄️  Setting up HireSenseAI database on Filess.io..."

# Set environment variables for PostgreSQL connection
export PGPASSWORD='badd362df4673b12c03e39c9cdbe4eff4040527a'
export PGUSER='HireSenseAI_comeballwe'
export PGHOST='bauli.h.filess.io'
export PGPORT='5434'
export PGDATABASE='HireSenseAI_comeballwe'

echo "📡 Testing database connection..."

# Test the connection first
if psql -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check your credentials."
    exit 1
fi

echo "🏗️  Creating database tables..."

# Run the setup SQL
psql << 'EOF'
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

-- Add foreign key constraints (with error handling)
DO $$
BEGIN
    -- Add Account foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Account_userId_fkey'
    ) THEN
        ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- Add Session foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Session_userId_fkey'
    ) THEN
        ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Insert a test admin user (password: admin123)
-- Hash for 'admin123': $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBG7Q6d16P9.6.
INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
VALUES ('admin-test-id', 'Admin User', 'admin@hiresense.ai', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
VALUES ('admin-account-id', 'admin-test-id', 'credentials', 'credentials', 'admin@hiresense.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBG7Q6d16P9.6.')
ON CONFLICT ("provider", "providerAccountId") DO NOTHING;

-- Display success message
SELECT 'Database setup completed successfully!' as message;

-- Show created tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
EOF

if [ $? -eq 0 ]; then
    echo "🎉 Database setup completed successfully!"
    echo ""
    echo "📋 What was created:"
    echo "   ✅ User table (for authentication)"
    echo "   ✅ Account table (for OAuth and credentials)"
    echo "   ✅ Session table (for user sessions)"
    echo "   ✅ VerificationToken table (for email verification)"
    echo "   ✅ All indexes and foreign keys"
    echo "   ✅ Test admin user"
    echo ""
    echo "🔑 Test Admin Credentials:"
    echo "   Email: admin@hiresense.ai"
    echo "   Password: admin123"
    echo ""
    echo "⚠️  Remember to change the admin password after first login!"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Test your app locally: npm run dev"
    echo "   2. Deploy to Vercel: npm run deploy:vercel"
    echo "   3. Create your real admin user: npm run admin:create"
else
    echo "❌ Database setup failed. Please check the error messages above."
fi
