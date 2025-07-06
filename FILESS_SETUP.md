# Filess.io Database Setup Guide

## Why Filess.io?

Filess.io is recommended for HireSenseAI because:
- ✅ **Completely Free**: No credit card required
- ✅ **PostgreSQL Compatible**: Works perfectly with Prisma
- ✅ **SSL Support**: Built-in security
- ✅ **Easy Setup**: 5-minute configuration
- ✅ **Reliable**: Good uptime for development and small production apps
- ✅ **No Time Limits**: Unlike some free tiers

## Step-by-Step Setup

### 1. Create Filess.io Account
1. Go to [filess.io](https://filess.io)
2. Click "Sign Up" (no credit card needed)
3. Verify your email address
4. Log into your dashboard

### 2. Create PostgreSQL Database
1. In your Filess.io dashboard, click "Create Database"
2. Select "PostgreSQL" as the database type
3. Choose a database name (e.g., `hiresense-prod`)
4. Select a region closest to your users
5. Click "Create Database"

### 3. Get Connection String
1. Once created, click on your database
2. Go to the "Connection" tab
3. Copy the "External Connection String"
4. It should look like:
   ```
   postgresql://username:password@hostname:port/database
   ```

### 4. Configure Connection String
Add `?schema=username` to the end of your connection string (replace `username` with your actual username):
```
postgresql://username:password@hostname:port/database?schema=username
```

**Note**: Filess.io doesn't require SSL, so we don't add `sslmode=require`. Also, you need to use your username as the schema name instead of `public`.

### 5. Test Connection (Optional)
You can test the connection locally:
```bash
# Install psql if you haven't already
psql "postgresql://username:password@hostname:port/database?sslmode=require"
```

## Environment Variable Setup

### For Local Development (.env)
```bash
DATABASE_URL="postgresql://your-username:your-password@your-host:port/your-database?schema=public"
```

### For Vercel Production
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add `DATABASE_URL` with your Filess.io connection string
4. Set it for Production, Preview, and Development environments

## Database Migration

After setting up Filess.io and deploying to Vercel:

1. **Automatic Migration (Recommended)**:
   The `vercel-build` script in package.json will automatically run:
   ```bash
   prisma generate && prisma db push && next build
   ```

2. **Manual Migration** (if needed):
   ```bash
   # Pull environment variables locally
   vercel env pull .env.local
   
   # Run migration
   npx prisma migrate deploy
   
   # Or push schema directly
   npx prisma db push
   ```

## Post-Setup Verification

### 1. Test Database Connection
Visit your deployed app's health endpoint:
```
https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "message": "All systems operational"
}
```

### 2. Create Admin User
```bash
# Pull environment variables
vercel env pull .env.local

# Run admin creation script
node scripts/create-production-admin.js
```

## Troubleshooting

### Connection Issues
1. **Check SSL Mode**: Ensure `?sslmode=require` is at the end
2. **Verify Credentials**: Double-check username/password
3. **Network Access**: Filess.io should allow all IPs by default
4. **Port Number**: Make sure the port is correct (usually 5432)

### Migration Issues
1. **Schema Sync**: Run `prisma db push` to sync schema
2. **Permission Errors**: Ensure your user has CREATE privileges
3. **Timeout**: Filess.io might be slower than other providers

### Performance Considerations
- Filess.io is great for development and small production apps
- For high-traffic production apps, consider upgrading to Neon or Supabase
- Connection pooling is handled by Prisma automatically

## Backup Recommendations

Since Filess.io is free, consider regular backups:

```bash
# Export database
pg_dump "postgresql://username:password@hostname:port/database?sslmode=require" > backup.sql

# Import to new database if needed
psql "new-connection-string" < backup.sql
```

## Migration to Other Providers

If you need to migrate later:

1. Export data from Filess.io
2. Set up new provider (Neon/Supabase)
3. Update DATABASE_URL in Vercel
4. Import data to new database
5. Test thoroughly

## Cost Comparison

| Provider | Free Tier | Paid Plans Start |
|----------|-----------|------------------|
| Filess.io | Unlimited (with fair use) | N/A |
| Neon | 512MB, 10GB transfer | $20/month |
| Supabase | 500MB, 2GB transfer | $25/month |
| Railway | $5 credit/month | $5/month |

## Security Notes

- Always use SSL (`?sslmode=require`)
- Don't commit connection strings to git
- Use environment variables only
- Rotate passwords periodically
- Monitor access logs in Filess.io dashboard
