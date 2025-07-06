/**
 * Script to update admin user credentials in the database
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

// Default admin credentials - you can change these
const ADMIN_EMAIL = 'admin@hiresenseai.com'
const ADMIN_PASSWORD = 'HireSense2025!'
const ADMIN_NAME = 'HireSense Admin'

async function updateAdminCredentials() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🔐 Updating admin credentials...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    
    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds)
    console.log('✅ Password hashed successfully')

    // Generate new IDs
    const userId = randomUUID()
    const accountId = randomUUID()

    // Remove existing admin user if any
    console.log('🗑️  Removing existing admin user...')
    await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = \'admin@hiresense.ai\'')
    await client.query('DELETE FROM "User" WHERE "email" = \'admin@hiresense.ai\'')
    
    // Also remove the old test admin
    await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = \'admin@hiresenseai.com\'')
    await client.query('DELETE FROM "User" WHERE "email" = \'admin@hiresenseai.com\'')

    // Insert new admin user
    console.log('👤 Creating new admin user...')
    await client.query(`
      INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [userId, ADMIN_NAME, ADMIN_EMAIL])

    // Insert new admin account with hashed password
    await client.query(`
      INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
      VALUES ($1, $2, 'credentials', 'credentials', $3, $4)
    `, [accountId, userId, ADMIN_EMAIL, hashedPassword])

    console.log('✅ Admin credentials updated successfully!')
    
    console.log('\n🔑 New Admin Credentials:')
    console.log(`   📧 Email: ${ADMIN_EMAIL}`)
    console.log(`   🔐 Password: ${ADMIN_PASSWORD}`)
    console.log(`   👤 Name: ${ADMIN_NAME}`)
    
    console.log('\n⚠️  Important Security Notes:')
    console.log('   - Change the password after first login')
    console.log('   - Use a strong, unique password in production')
    console.log('   - Consider enabling 2FA once logged in')
    
    console.log('\n🚀 You can now login at:')
    console.log('   - Development: http://localhost:3001/admin/login')
    console.log('   - Production: https://your-domain.vercel.app/admin/login')

  } catch (error) {
    console.error('❌ Failed to update admin credentials:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the update
updateAdminCredentials()
