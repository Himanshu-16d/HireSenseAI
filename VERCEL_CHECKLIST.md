# Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Database Setup
- [ ] Database provider chosen (Filess.io, Neon, Supabase, or Railway)
- [ ] Database created and connection string obtained
- [ ] Database URL uses SSL (`?sslmode=require`)
- [ ] Connection pooling enabled (recommended for production)

### ✅ Environment Variables Prepared
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generated 32+ character secret
- [ ] `NEXTAUTH_URL` - Your Vercel app URL
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel app URL
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)
- [ ] `NVIDIA_API_KEY` - NVIDIA AI API key (optional)

### ✅ Google OAuth Configuration
- [ ] Google Cloud project created
- [ ] OAuth 2.0 credentials created
- [ ] Authorized origins set: `https://your-app.vercel.app`
- [ ] Callback URL set: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Google+ API enabled

### ✅ Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] All sensitive files in .gitignore
- [ ] Build scripts tested locally
- [ ] Dependencies up to date

## Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Set framework preset to "Next.js"

### 2. Configure Project Settings
- Build Command: `prisma generate && prisma db push && pnpm run build`
- Install Command: `pnpm install --no-frozen-lockfile`
- Output Directory: `.next`
- Root Directory: `./`

### 3. Set Environment Variables
In Vercel Dashboard > Settings > Environment Variables:
- Add all variables from `.env.production.example`
- Set for Production, Preview, and Development
- Ensure no trailing spaces or quotes

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit deployment URL
4. Test basic functionality

## Post-Deployment Verification

### ✅ Health Checks
- [ ] Visit `/api/health` - should return healthy status
- [ ] Database connection working
- [ ] Authentication configured

### ✅ Authentication Testing
- [ ] Google OAuth login works
- [ ] Email/password registration works
- [ ] Session persistence works
- [ ] Role-based access working

### ✅ Core Features
- [ ] Resume builder loads
- [ ] Job finder works
- [ ] Admin dashboard accessible (for admin users)
- [ ] AI features functional (if API keys provided)

### ✅ Performance
- [ ] Page load times acceptable
- [ ] Images loading properly
- [ ] Static assets cached correctly
- [ ] No console errors

## Troubleshooting

### Common Issues
1. **Build Fails**: Check environment variables are set
2. **Database Connection Error**: Verify DATABASE_URL and SSL settings
3. **OAuth Error**: Check Google OAuth configuration and URLs
4. **404 Errors**: Ensure all routes are properly configured
5. **Function Timeout**: Check function memory allocation in vercel.json

### Debug Steps
1. Check Vercel Function logs
2. Verify environment variables
3. Test database connection manually
4. Check OAuth provider settings
5. Review build logs for errors

## Monitoring & Maintenance

### Recommended Tools
- Vercel Analytics (built-in)
- Sentry for error tracking
- Uptime monitoring
- Database monitoring

### Regular Tasks
- Monitor function execution times
- Review error logs
- Update dependencies
- Backup database
- Review security settings

## Production Optimizations

### Performance
- Enable Vercel Analytics
- Configure CDN caching
- Optimize images
- Monitor Core Web Vitals

### Security
- Regular dependency updates
- Environment variable rotation
- SSL certificate monitoring
- Access log review

### Scaling
- Monitor function usage
- Database connection pooling
- Consider edge functions for global users
- Implement rate limiting
