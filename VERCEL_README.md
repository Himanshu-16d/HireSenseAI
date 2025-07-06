# 🚀 Vercel Production Deployment Guide

## Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hiresenseai&env=DATABASE_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXT_PUBLIC_APP_URL)

### Manual Deployment

1. **Prerequisites**
   ```bash
   npm install -g vercel
   npm install -g pnpm
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd HireSenseAI
   pnpm install
   ```

3. **Environment Setup**
   - Copy `.env.production.example` to prepare your environment variables
   - Set up database (Neon recommended)
   - Configure Google OAuth
   - Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

4. **Deploy**
   ```bash
   pnpm run deploy:vercel
   ```

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret key (32+ chars) | ✅ |
| `NEXTAUTH_URL` | Your Vercel app URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | ✅ |
| `NVIDIA_API_KEY` | NVIDIA AI API key | ❌ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ❌ |

## Post-Deployment Setup

1. **Health Check**
   ```
   GET https://your-app.vercel.app/api/health
   ```

2. **Create Admin User**
   ```bash
   vercel env pull .env.local
   pnpm run admin:create
   ```

3. **Test Features**
   - Authentication (Google OAuth + Email/Password)
   - Resume Builder
   - Job Finder
   - Admin Dashboard

## Database Providers

### Filess.io (Recommended)
- Free PostgreSQL hosting
- No credit card required
- Simple setup
- SSL support included

### Neon
- Free tier: 512 MB storage
- Serverless PostgreSQL
- Auto-scaling
- Built-in connection pooling

### Supabase
- Free tier: 500 MB storage
- Real-time subscriptions
- Built-in auth (not used)
- Powerful dashboard

### Railway
- Free tier: $5/month credit
- Simple deployment
- Multiple databases

## Performance Optimizations

- ✅ Static asset caching (31536000 seconds)
- ✅ Image optimization with Next.js
- ✅ Function memory allocation optimized
- ✅ Connection pooling for database
- ✅ Standalone output for smaller builds
- ✅ Security headers configured

## Monitoring

After deployment, monitor:
- Function execution times
- Database connection usage
- Error rates
- Core Web Vitals

## Troubleshooting

### Build Fails
1. Check environment variables are set
2. Verify DATABASE_URL format
3. Check for TypeScript errors

### Database Connection Issues
1. Verify SSL mode in DATABASE_URL
2. Check connection string format
3. Ensure database is accessible

### Authentication Issues
1. Verify Google OAuth configuration
2. Check NEXTAUTH_URL matches deployment URL
3. Ensure NEXTAUTH_SECRET is 32+ characters

## Support

- 📖 [Full Deployment Guide](./VERCEL_DEPLOYMENT.md)
- ✅ [Deployment Checklist](./VERCEL_CHECKLIST.md)
- 🔧 [Environment Variables](./env.vercel.example)

## Architecture

```
HireSenseAI (Vercel)
├── Next.js App Router
├── PostgreSQL Database (Neon/Supabase)
├── NextAuth.js Authentication
├── Prisma ORM
├── AI Integration (NVIDIA/OpenAI)
└── Admin Dashboard
```

Built with ❤️ for modern recruiting and job searching.
