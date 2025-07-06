#!/usr/bin/env node

/**
 * Test admin authentication logic directly
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function testAdminAuth() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🔧 Testing admin authentication logic...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')

    // Test the exact query used in the API
    const result = await client.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u."emailVerified", u."createdAt", u."updatedAt",
        a.password
      FROM "User" u
      INNER JOIN "Account" a ON u.id = a."userId"
      WHERE u.email = $1 AND a.provider = 'credentials' AND u.role = 'admin'
    `, ['admin@hiresenseai.com'])

    console.log('📊 Query result rows:', result.rows.length)
    
    if (result.rows.length === 0) {
      console.log('❌ No admin user found with the query used in the API')
      
      // Try a different approach - check what users exist
      const allUsers = await client.query('SELECT id, email, role FROM "User" WHERE email = $1', ['admin@hiresenseai.com'])
      console.log('🔍 Users with that email:', allUsers.rows)
      
      const allAccounts = await client.query('SELECT "userId", provider FROM "Account"')
      console.log('🔍 All accounts:', allAccounts.rows)
      
      return
    }

    const user = result.rows[0]
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    })

    // Test password verification
    const isValid = await bcrypt.compare('HireSense2025!', user.password)
    console.log('🔐 Password validation:', isValid ? '✅ Valid' : '❌ Invalid')
    
    if (isValid) {
      console.log('✅ Admin authentication would succeed!')
    } else {
      console.log('❌ Admin authentication would fail due to password mismatch')
    }

  } catch (error) {
    console.error('❌ Test error:', error.message)
    console.error('Full error:', error)
  } finally {
    await client.end()
  }
}

testAdminAuth()
