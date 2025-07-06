@echo off
echo 🗄️  Setting up HireSenseAI database on Filess.io...

REM Set environment variables for PostgreSQL connection
set PGPASSWORD=badd362df4673b12c03e39c9cdbe4eff4040527a
set PGUSER=HireSenseAI_comeballwe
set PGHOST=bauli.h.filess.io
set PGPORT=5434
set PGDATABASE=HireSenseAI_comeballwe

echo 📡 Testing database connection...

REM Test the connection first
psql -c "SELECT version();" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database connection successful!
) else (
    echo ❌ Database connection failed. Please check your credentials.
    echo Make sure PostgreSQL client is installed: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo 🏗️  Creating database tables...

REM Create a temporary SQL file
echo -- Create tables for NextAuth.js > temp_setup.sql
echo CREATE TABLE IF NOT EXISTS "Account" ( >> temp_setup.sql
echo     "id" TEXT NOT NULL, >> temp_setup.sql
echo     "userId" TEXT NOT NULL, >> temp_setup.sql
echo     "type" TEXT NOT NULL, >> temp_setup.sql
echo     "provider" TEXT NOT NULL, >> temp_setup.sql
echo     "providerAccountId" TEXT NOT NULL, >> temp_setup.sql
echo     "refresh_token" TEXT, >> temp_setup.sql
echo     "access_token" TEXT, >> temp_setup.sql
echo     "expires_at" INTEGER, >> temp_setup.sql
echo     "token_type" TEXT, >> temp_setup.sql
echo     "scope" TEXT, >> temp_setup.sql
echo     "id_token" TEXT, >> temp_setup.sql
echo     "session_state" TEXT, >> temp_setup.sql
echo     "password" TEXT, >> temp_setup.sql
echo     CONSTRAINT "Account_pkey" PRIMARY KEY ("id") >> temp_setup.sql
echo ); >> temp_setup.sql
echo. >> temp_setup.sql

echo CREATE TABLE IF NOT EXISTS "Session" ( >> temp_setup.sql
echo     "id" TEXT NOT NULL, >> temp_setup.sql
echo     "sessionToken" TEXT NOT NULL, >> temp_setup.sql
echo     "userId" TEXT NOT NULL, >> temp_setup.sql
echo     "expires" TIMESTAMP(3) NOT NULL, >> temp_setup.sql
echo     CONSTRAINT "Session_pkey" PRIMARY KEY ("id") >> temp_setup.sql
echo ); >> temp_setup.sql
echo. >> temp_setup.sql

echo CREATE TABLE IF NOT EXISTS "User" ( >> temp_setup.sql
echo     "id" TEXT NOT NULL, >> temp_setup.sql
echo     "name" TEXT, >> temp_setup.sql
echo     "email" TEXT, >> temp_setup.sql
echo     "emailVerified" TIMESTAMP(3), >> temp_setup.sql
echo     "image" TEXT, >> temp_setup.sql
echo     "role" TEXT DEFAULT 'candidate', >> temp_setup.sql
echo     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, >> temp_setup.sql
echo     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, >> temp_setup.sql
echo     CONSTRAINT "User_pkey" PRIMARY KEY ("id") >> temp_setup.sql
echo ); >> temp_setup.sql
echo. >> temp_setup.sql

echo CREATE TABLE IF NOT EXISTS "VerificationToken" ( >> temp_setup.sql
echo     "identifier" TEXT NOT NULL, >> temp_setup.sql
echo     "token" TEXT NOT NULL, >> temp_setup.sql
echo     "expires" TIMESTAMP(3) NOT NULL >> temp_setup.sql
echo ); >> temp_setup.sql
echo. >> temp_setup.sql

echo -- Create unique indexes >> temp_setup.sql
echo CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId"); >> temp_setup.sql
echo CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken"); >> temp_setup.sql
echo CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email"); >> temp_setup.sql
echo CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token"); >> temp_setup.sql
echo CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token"); >> temp_setup.sql
echo. >> temp_setup.sql

echo -- Insert test admin user >> temp_setup.sql
echo INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") >> temp_setup.sql
echo VALUES ('admin-test-id', 'Admin User', 'admin@hiresense.ai', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) >> temp_setup.sql
echo ON CONFLICT ("email") DO NOTHING; >> temp_setup.sql
echo. >> temp_setup.sql

echo INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password") >> temp_setup.sql
echo VALUES ('admin-account-id', 'admin-test-id', 'credentials', 'credentials', 'admin@hiresense.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBG7Q6d16P9.6.') >> temp_setup.sql
echo ON CONFLICT ("provider", "providerAccountId") DO NOTHING; >> temp_setup.sql

REM Execute the SQL file
psql -f temp_setup.sql

if %errorlevel% equ 0 (
    echo 🎉 Database setup completed successfully!
    echo.
    echo 📋 What was created:
    echo    ✅ User table (for authentication)
    echo    ✅ Account table (for OAuth and credentials)
    echo    ✅ Session table (for user sessions)
    echo    ✅ VerificationToken table (for email verification)
    echo    ✅ All indexes
    echo    ✅ Test admin user
    echo.
    echo 🔑 Test Admin Credentials:
    echo    Email: admin@hiresense.ai
    echo    Password: admin123
    echo.
    echo ⚠️  Remember to change the admin password after first login!
    echo.
    echo 🚀 Next steps:
    echo    1. Test your app locally: pnpm run dev
    echo    2. Deploy to Vercel: pnpm run deploy:vercel
    echo    3. Create your real admin user: pnpm run admin:create
) else (
    echo ❌ Database setup failed. Please check the error messages above.
)

REM Clean up temp file
del temp_setup.sql

echo.
echo Press any key to continue...
pause >nul
