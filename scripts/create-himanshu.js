/**
 * Create Himanshu admin user
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

const ADMIN_EMAIL = 'himanshu@hiresense.ai'
const ADMIN_PASSWORD = 'Himanshu@pseudocoders25'
const ADMIN_NAME = 'Himanshu'

async function createHimanshuAdmin() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('Creating Himanshu admin...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    
    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds)
    console.log('Password hashed successfully')

    // Generate new IDs
    const userId = randomUUID()
    const accountId = randomUUID()

    // Remove existing admin user if any
    console.log('Removing existing user...')
    await client.query('DELETE FROM "Account" WHERE "provider" = \'credentials\' AND "providerAccountId" = $1', [ADMIN_EMAIL])
    await client.query('DELETE FROM "User" WHERE "email" = $1', [ADMIN_EMAIL])

    // Insert new admin user
    console.log('Creating new admin user...')
    await client.query(`
      INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [userId, ADMIN_NAME, ADMIN_EMAIL])

    // Insert new admin account with hashed password
    await client.query(`
      INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
      VALUES ($1, $2, 'credentials', 'credentials', $3, $4)
    `, [accountId, userId, ADMIN_EMAIL, hashedPassword])

    console.log('Admin credentials created successfully!')
    
    console.log('\nLogin Credentials:')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    console.log(`Name: ${ADMIN_NAME}`)
    
    console.log('\nLogin at: http://localhost:3001/admin/login')

  } catch (error) {
    console.error('Failed to create admin credentials:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  } finally {
    await client.end()
    console.log('Database connection closed')
  }
}

// Run the update
createHimanshuAdmin().catch(console.error)
