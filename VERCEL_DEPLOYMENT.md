# Vercel Deployment Guide for HireSenseAI

## Prerequisites
- GitHub repository with your code
- Vercel account
- Database (Neon, Supabase, or Railway)
- Google OAuth credentials

## Step-by-Step Deployment

### 1. Database Setup (Choose one)

#### Option A: Filess.io (Recommended - Free)
1. Go to [filess.io](https://filess.io)
2. Create a free account (no credit card required)
3. Create a new PostgreSQL database
4. Copy the connection string
5. Ensure it includes `?sslmode=require` at the end
6. Save for later use as `DATABASE_URL`

#### Option B: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy the connection string
4. Save for later use as `DATABASE_URL`

#### Option C: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string (use pooling connection)
5. Save for later use as `DATABASE_URL`

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized origins: `https://your-app-name.vercel.app`
6. Set callback URL: `https://your-app-name.vercel.app/api/auth/callback/google`
7. Save Client ID and Secret

### 3. Deploy to Vercel

#### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Set framework preset to "Next.js"

#### Configure Environment Variables
In Vercel project settings, add these environment variables:

```bash
# Database
DATABASE_URL=your_database_connection_string

# NextAuth
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=https://your-app-name.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
PRISMA_GENERATE=true

# Optional: NVIDIA AI
NVIDIA_API_KEY=your_nvidia_key
NVIDIA_API_BASE_URL=https://integrate.api.nvidia.com/v1

# Migration Secret (for running database migrations)
MIGRATION_SECRET=your_secure_migration_key
```

#### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

### 4. Post-Deployment Setup

#### Run Database Migration
1. Go to your deployed app
2. Visit: `https://your-app-name.vercel.app/api/migrate`
3. Or use Vercel CLI:
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   ```

#### Create Admin User
1. Go to your app and register as a candidate first
2. Connect to your database directly
3. Update your user's role to 'admin':
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 5. Verify Deployment

Test these features:
- [ ] Home page loads
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Admin panel accessible (`/admin/login`)
- [ ] Role selection works
- [ ] AI features function (if API keys configured)

### 6. Production Optimizations

#### Performance
- Enable Vercel Analytics
- Configure ISR for static pages
- Optimize images with Vercel Image Optimization

#### Security
- Set up proper CORS policies
- Configure rate limiting
- Enable security headers

#### Monitoring
- Set up Vercel monitoring
- Configure error tracking
- Set up database monitoring

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check environment variables are set
   - Ensure Prisma generates client: `PRISMA_GENERATE=true`

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database is accessible from Vercel
   - Ensure SSL is enabled

3. **OAuth Issues**
   - Verify Google OAuth URLs match Vercel domain
   - Check NEXTAUTH_URL is set correctly

4. **Admin Access Issues**
   - Manually set user role to 'admin' in database
   - Ensure admin login page works

### Environment Variables Checklist
- [ ] DATABASE_URL
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] NEXT_PUBLIC_APP_URL
- [ ] NODE_ENV=production
- [ ] PRISMA_GENERATE=true

## Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
