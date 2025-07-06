/**
 * Script to update admin user credentials in the database
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

// Multiple admin credentials to create
const ADMIN_USERS = [
  {
    email: 'himanshu@hiresense.ai',
    password: 'Himanshu@pseudocoders25',
    name: 'Himanshu'
  },
  {
    email: 'rishika@hiresense.ai',
    password: 'Rishika@pseudocoders25',
    name: 'Rishika'
  },
  {
    email: 'smrati@hiresense.ai',
    password: 'Smrati@pseudocoders25',
    name: 'Smrati'
  },
  {
    email: 'shikha@hiresense.ai',
    password: 'Shikha@pseudocoders25',
    name: 'Shikha'
  }
]

async function updateAdminCredentials() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🔐 Creating multiple admin users...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    
    const saltRounds = 12
    
    // Remove old admin user if exists
    console.log('🗑️  Removing old admin user...')
    await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = \'admin@hiresenseai.com\'')
    await client.query('DELETE FROM "User" WHERE "email" = \'admin@hiresenseai.com\'')
    
    for (const adminUser of ADMIN_USERS) {
      console.log(`Creating ${adminUser.name} (${adminUser.email})...`)
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds)

      // Generate new IDs
      const userId = randomUUID()
      const accountId = randomUUID()

      // Remove existing admin user if any
      await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = $1', [adminUser.email])
      await client.query('DELETE FROM "User" WHERE "email" = $1', [adminUser.email])

      // Insert new admin user
      await client.query(`
        INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [userId, adminUser.name, adminUser.email])

      // Insert new admin account with hashed password
      await client.query(`
        INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
        VALUES ($1, $2, 'credentials', 'credentials', $3, $4)
      `, [accountId, userId, adminUser.email, hashedPassword])

      console.log(`✅ ${adminUser.name} created successfully!`)
    }

    console.log('✅ All admin credentials created successfully!')
    
    console.log('\n🔑 New Admin Credentials:')
    ADMIN_USERS.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name}`)
      console.log(`      📧 Email: ${user.email}`)
      console.log(`      🔐 Password: ${user.password}`)
      console.log('')
    })
    
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
