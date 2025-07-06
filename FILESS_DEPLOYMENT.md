# 🚀 Filess.io + Vercel Deployment Guide

## Your Database Configuration ✅

**Database URL**: `postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe?schema=public`

✅ **Connection Tested**: Database connection is working!

## 📋 Next Steps for Deployment

### 1. Manual Database Setup (Required for Filess.io)

Since Filess.io has limited migration permissions, you need to set up the database manually:

1. **Go to your Filess.io Console**:
   - Visit [filess.io](https://filess.io)
   - Log into your account
   - Navigate to your database: `HireSenseAI_comeballwe`

2. **Run the Setup SQL**:
   - Open the SQL console in Filess.io
   - Copy and paste the contents of `migrations/filess-manual-setup.sql`
   - Execute the SQL to create all required tables

### 2. Deploy to Vercel

```bash
# Set your environment variables in Vercel first!
pnpm run deploy:vercel
```

### 3. Environment Variables for Vercel

Set these in **Vercel Dashboard > Settings > Environment Variables**:

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe?schema=public"

# NextAuth (REQUIRED)
NEXTAUTH_SECRET="your-32-character-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App URL (REQUIRED)
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Optional APIs
NVIDIA_API_KEY="your-nvidia-api-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
```

### 4. Test Your Deployment

After deployment:

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Test Login**: Try both Google OAuth and email/password
3. **Admin Access**: Use the test admin account:
   - Email: `admin@hiresense.ai`
   - Password: `admin123`

### 5. Create Your Real Admin User

```bash
# Pull environment variables locally
vercel env pull .env.local

# Create your admin user
pnpm run admin:create
```

## 🛠️ Manual Database Setup SQL

The file `migrations/filess-manual-setup.sql` contains:
- All NextAuth.js tables (User, Account, Session, VerificationToken)
- Proper indexes and constraints
- A test admin user for initial access

**Test Admin Credentials** (change after first login):
- Email: `admin@hiresense.ai`
- Password: `admin123`

## 🔍 Troubleshooting

### Database Connection Issues
- ✅ **Connection works**: Your URL is correctly configured
- ✅ **No SSL required**: Filess.io doesn't use SSL
- ✅ **Schema specified**: Using `?schema=public`

### If Tables Don't Exist
1. Run the SQL from `migrations/filess-manual-setup.sql` in Filess.io console
2. Check table creation was successful
3. Restart your Vercel deployment

### Migration Errors on Vercel
- Don't worry! We've disabled automatic migrations
- Tables are created manually via SQL
- Prisma will work with existing tables

## 📚 Files Updated for Filess.io

- ✅ `.env` - Updated with your database URL
- ✅ `vercel.json` - Removed automatic DB push
- ✅ `package.json` - Updated build commands
- ✅ Environment examples - Removed SSL requirements
- ✅ `migrations/filess-manual-setup.sql` - Manual setup SQL

## 🎯 Deployment Checklist

### Before Deployment
- [ ] Run SQL from `migrations/filess-manual-setup.sql` in Filess.io
- [ ] Set all environment variables in Vercel
- [ ] Test database connection locally

### After Deployment
- [ ] Visit `/api/health` endpoint
- [ ] Test login with admin@hiresense.ai / admin123
- [ ] Create your real admin user
- [ ] Test all major features
- [ ] Change default admin password

## 🚀 Ready to Deploy!

Your HireSenseAI app is configured for Filess.io and ready for Vercel deployment. The main difference from other providers is the manual database setup, but everything else works the same way.

**Next**: Run the SQL setup, configure Vercel environment variables, and deploy! 🎉
