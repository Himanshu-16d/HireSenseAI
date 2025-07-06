# Admin User Management

## Current Admin Credentials

### Primary Admin User
- **Email**: `admin@hiresenseai.com`
- **Password**: `HireSense2025!`
- **Name**: `HireSense Admin`
- **Role**: `admin`

## Admin Access Points

### Admin Login Page
- **Development**: http://localhost:3001/admin/login
- **Production**: https://your-domain.vercel.app/admin/login

### Admin Dashboard
- **Development**: http://localhost:3001/admin
- **Production**: https://your-domain.vercel.app/admin
- (Automatically redirects to login if not authenticated)

### Regular User Login (for comparison)
- **Development**: http://localhost:3001/login
- **Production**: https://your-domain.vercel.app/login

## Admin Management Scripts

### Update Admin Credentials
To update the existing admin user with new credentials:
```bash
pnpm run admin:update
```

### Create New Admin User (Interactive)
To create a new admin user or update existing ones interactively:
```bash
pnpm run admin:create
```

### Test Admin Login
To verify admin credentials are working:
```bash
node scripts/test-admin-login.js
```

## Login URLs

### Development
- URL: http://localhost:3001/admin/login
- Use the credentials above

### Production
- URL: https://your-domain.vercel.app/admin/login
- Make sure to update environment variables in Vercel

## Security Best Practices

1. **Change Default Password**: After first login, change the password to something more secure
2. **Use Strong Passwords**: Minimum 8 characters with mix of letters, numbers, and symbols
3. **Limit Admin Access**: Only create admin accounts for users who need administrative privileges
4. **Regular Updates**: Periodically update admin passwords
5. **Environment Variables**: In production, consider using environment variables for sensitive data

## Database Schema

Admin users are stored with:
- `role: 'admin'` in the User table
- Hashed password in the Account table with `provider: 'credentials'`
- Email verification is automatically set to current timestamp

## Troubleshooting

### Can't Login
1. Verify credentials using the test script
2. Check that the user exists in the database
3. Ensure the password hash is correct
4. Verify the role is set to 'admin'

### Create New Admin
If you need to create a completely new admin user, use:
```bash
pnpm run admin:create
```

### Reset Admin Password
To reset an existing admin password, use:
```bash
pnpm run admin:update
```
