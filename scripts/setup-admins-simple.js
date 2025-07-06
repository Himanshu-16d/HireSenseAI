/**
 * Script to setup multiple admin users
 * Based on the working update-admin.js pattern
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

async function setupAdmins() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('Setting up admin users...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    console.log('Connected to database')
    
    const saltRounds = 12
    
    for (const admin of ADMIN_USERS) {
      console.log(`Creating ${admin.name} (${admin.email})...`)
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(admin.password, saltRounds)
      
      // Generate new IDs
      const userId = randomUUID()
      const accountId = randomUUID()

      // Remove existing user if any
      await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = $1', [admin.email])
      await client.query('DELETE FROM "User" WHERE "email" = $1', [admin.email])

      // Insert new admin user
      await client.query(`
        INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [userId, admin.name, admin.email])

      // Insert new admin account with hashed password
      await client.query(`
        INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
        VALUES ($1, $2, 'credentials', 'credentials', $3, $4)
      `, [accountId, userId, admin.email, hashedPassword])

      console.log(`✅ ${admin.name} created successfully`)
    }

    console.log('\nAll admin users created successfully!')
    
    console.log('\nAdmin Credentials:')
    ADMIN_USERS.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Password: ${user.password}`)
    })
    
    console.log('\nLogin at: http://localhost:3001/admin/login')

  } catch (error) {
    console.error('Failed to setup admin users:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the setup
setupAdmins()
