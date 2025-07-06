/**
 * Interactive script to create or update admin credentials
 * Usage: node scripts/create-admin.js
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import readline from 'readline'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password.length >= 8
}

async function createAdmin() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🔐 HireSenseAI Admin User Creator\n')
    
    // Get admin details
    let email
    while (true) {
      email = await askQuestion('Enter admin email: ')
      if (validateEmail(email)) break
      console.log('❌ Please enter a valid email address')
    }

    let password
    while (true) {
      password = await askQuestion('Enter admin password (min 8 characters): ')
      if (validatePassword(password)) break
      console.log('❌ Password must be at least 8 characters long')
    }

    const name = await askQuestion('Enter admin name (default: Admin User): ') || 'Admin User'

    console.log('\n📋 Admin Details:')
    console.log(`   📧 Email: ${email}`)
    console.log(`   👤 Name: ${name}`)
    console.log(`   🔐 Password: ${'*'.repeat(password.length)}`)

    const confirm = await askQuestion('\nCreate this admin user? (y/N): ')
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Admin creation cancelled')
      rl.close()
      return
    }

    // Connect to database
    console.log('\n📡 Connecting to database...')
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    
    // Hash the password
    console.log('🔒 Hashing password...')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Generate new IDs
    const userId = randomUUID()
    const accountId = randomUUID()

    // Check if user already exists
    const existingUser = await client.query('SELECT id FROM "User" WHERE "email" = $1', [email])
    
    if (existingUser.rows.length > 0) {
      const update = await askQuestion('User with this email already exists. Update? (y/N): ')
      if (update.toLowerCase() !== 'y' && update.toLowerCase() !== 'yes') {
        console.log('❌ Admin creation cancelled')
        rl.close()
        return
      }
      
      // Remove existing user
      console.log('🗑️  Removing existing user...')
      await client.query('DELETE FROM "Account" WHERE "userId" = $1', [existingUser.rows[0].id])
      await client.query('DELETE FROM "User" WHERE "id" = $1', [existingUser.rows[0].id])
    }

    // Insert new admin user
    console.log('👤 Creating admin user...')
    await client.query(`
      INSERT INTO "User" ("id", "name", "email", "role", "emailVerified", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [userId, name, email])

    // Insert new admin account with hashed password
    await client.query(`
      INSERT INTO "Account" ("id", "userId", "type", "provider", "providerAccountId", "password")
      VALUES ($1, $2, 'credentials', 'credentials', $3, $4)
    `, [accountId, userId, email, hashedPassword])

    console.log('\n✅ Admin user created successfully!')
    
    console.log('\n🔑 Login Credentials:')
    console.log(`   📧 Email: ${email}`)
    console.log(`   🔐 Password: ${password}`)
    
    console.log('\n🚀 Login URLs:')
    console.log('   - Development: http://localhost:3001/admin/login')
    console.log('   - Production: https://your-domain.vercel.app/admin/login')

    console.log('\n⚠️  Security Reminders:')
    console.log('   - Store these credentials securely')
    console.log('   - Change password after first login')
    console.log('   - Use strong, unique passwords in production')

  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error.message)
    process.exit(1)
  } finally {
    await client.end()
    rl.close()
  }
}
// Run the creator
createAdmin()
