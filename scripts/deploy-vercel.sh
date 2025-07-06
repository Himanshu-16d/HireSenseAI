#!/bin/bash

# HireSenseAI Vercel Deployment Script
# This script helps prepare and deploy the application to Vercel

set -e

echo "🚀 HireSenseAI Vercel Deployment"
echo "================================"

# Check if required tools are installed
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Please install pnpm first." >&2; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI is required but not installed. Run: npm i -g vercel" >&2; exit 1; }

# Check if .env.production.example exists
if [ ! -f ".env.production.example" ]; then
    echo "❌ .env.production.example not found. Please check the file exists."
    exit 1
fi

echo "✅ All required tools are available"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm prisma generate

# Run type checking
echo "🔍 Running type check..."
pnpm run type-check

# Run linting
echo "🧹 Running linter..."
pnpm run lint

# Run tests
echo "🧪 Running tests..."
pnpm run test

echo "✅ All checks passed!"

# Check if user is logged into Vercel
if ! vercel whoami >/dev/null 2>&1; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "📋 Pre-deployment checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Prisma client generated"
echo "3. ✅ Type checking passed"
echo "4. ✅ Linting passed"
echo "5. ✅ Tests passed"
echo ""
echo "🚨 Make sure you have set up the following in Vercel Dashboard:"
echo "   - Database (Neon/Supabase) and DATABASE_URL"
echo "   - Google OAuth credentials"
echo "   - NEXTAUTH_SECRET (32+ characters)"
echo "   - All other environment variables from .env.production.example"
echo ""

read -p "Are you ready to deploy? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your deployment URL"
    echo "2. Test the /api/health endpoint"
    echo "3. Create an admin user using the production script"
    echo "4. Test all major features"
    echo ""
    echo "To create an admin user after deployment:"
    echo "vercel env pull .env.local"
    echo "node scripts/create-production-admin.js"
else
    echo "Deployment cancelled."
fi
