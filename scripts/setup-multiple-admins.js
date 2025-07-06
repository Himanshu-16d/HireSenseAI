/**
 * Script to set up multiple admin users in the database
 * This will create the admin users with the specified credentials
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

// Admin users to create
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

async function setupMultipleAdmins() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('Setting up multiple admin users...\n')
    console.log('DEBUG: Starting database connection...')
    
    // Connect to database
    await client.connect()
    console.log('DEBUG: Connected to database successfully')
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    console.log('DEBUG: Set search path successfully')
    
    console.log('📋 Admin users to create:')
    ADMIN_USERS.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`)
    })
    console.log('')

    const saltRounds = 12
    let successCount = 0
    let errorCount = 0

    for (const adminUser of ADMIN_USERS) {
      try {
        console.log(`👤 Processing ${adminUser.name} (${adminUser.email})...`)
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds)
        
        // Generate new IDs
        const userId = randomUUID()
        const accountId = randomUUID()

        // Check if user already exists
        const existingUser = await client.query('SELECT id FROM "User" WHERE "email" = $1', [adminUser.email])
        
        if (existingUser.rows.length > 0) {
          console.log(`   ℹ️  User already exists, updating...`)
          
          // Remove existing user and account
          await client.query('DELETE FROM "Account" WHERE "userId" = $1', [existingUser.rows[0].id])
          await client.query('DELETE FROM "User" WHERE "id" = $1', [existingUser.rows[0].id])
        }

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

        console.log(`   ✅ ${adminUser.name} created successfully`)
        successCount++
        
      } catch (error) {
        console.log(`   ❌ Failed to create ${adminUser.name}: ${error.message}`)
        errorCount++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   ✅ Successfully created: ${successCount} admin users`)
    console.log(`   ❌ Failed: ${errorCount} admin users`)
    
    if (successCount > 0) {
      console.log('\n🔑 Admin Credentials:')
      ADMIN_USERS.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name}`)
        console.log(`      📧 Email: ${user.email}`)
        console.log(`      🔐 Password: ${user.password}`)
        console.log('')
      })
      
      console.log('🚀 Login URLs:')
      console.log('   - Development: http://localhost:3001/admin/login')
      console.log('   - Production: https://your-domain.vercel.app/admin/login')

      console.log('\n⚠️  Security Reminders:')
      console.log('   - Store these credentials securely')
      console.log('   - Consider changing passwords after first login')
      console.log('   - Use strong, unique passwords in production')
      console.log('   - Limit admin access to authorized personnel only')
    }

  } catch (error) {
    console.error('\n❌ Failed to setup admin users:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the setup
setupMultipleAdmins()
