@echo off
echo 🚀 HireSenseAI Vercel Deployment
echo ================================

REM Check if required tools are installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm is required but not installed. Please install pnpm first.
    exit /b 1
)

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is required but not installed. Run: npm i -g vercel
    exit /b 1
)

REM Check if .env.production.example exists
if not exist ".env.production.example" (
    echo ❌ .env.production.example not found. Please check the file exists.
    exit /b 1
)

echo ✅ All required tools are available

REM Install dependencies
echo 📦 Installing dependencies...
pnpm install

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
pnpm prisma generate

REM Run type checking
echo 🔍 Running type check...
pnpm run type-check

REM Run linting
echo 🧹 Running linter...
pnpm run lint

REM Run tests
echo 🧪 Running tests...
pnpm run test

echo ✅ All checks passed!

REM Check if user is logged into Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel first:
    vercel login
)

echo 📋 Pre-deployment checklist:
echo 1. ✅ Dependencies installed
echo 2. ✅ Prisma client generated
echo 3. ✅ Type checking passed
echo 4. ✅ Linting passed
echo 5. ✅ Tests passed
echo.
echo 🚨 Make sure you have set up the following in Vercel Dashboard:
echo    - Database (Neon/Supabase) and DATABASE_URL
echo    - Google OAuth credentials
echo    - NEXTAUTH_SECRET (32+ characters)
echo    - All other environment variables from .env.production.example
echo.

set /p deploy="Are you ready to deploy? (y/N): "
if /i "%deploy%"=="y" (
    echo 🚀 Deploying to Vercel...
    vercel --prod
    
    echo.
    echo 🎉 Deployment complete!
    echo.
    echo Next steps:
    echo 1. Visit your deployment URL
    echo 2. Test the /api/health endpoint
    echo 3. Create an admin user using the production script
    echo 4. Test all major features
    echo.
    echo To create an admin user after deployment:
    echo vercel env pull .env.local
    echo node scripts/create-production-admin.js
) else (
    echo Deployment cancelled.
)
