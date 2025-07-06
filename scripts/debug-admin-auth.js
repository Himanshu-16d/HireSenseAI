/**
 * Debug script to test admin authentication step by step
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function debugAdminAuth() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🔍 Debugging Admin Authentication...\n')

    // Connect to database
    console.log('1. Testing database connection...')
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    console.log('✅ Database connected')

    // Check if admin user exists
    console.log('\n2. Checking admin user existence...')
    const userQuery = `
      SELECT id, name, email, role, "emailVerified", "createdAt", "updatedAt"
      FROM "User" 
      WHERE email = $1
    `
    const userResult = await client.query(userQuery, ['admin@hiresenseai.com'])
    
    if (userResult.rows.length === 0) {
      console.log('❌ Admin user not found in User table')
      return
    }
    
    const user = userResult.rows[0]
    console.log('✅ Admin user found:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Name: ${user.name}`)

    // Check admin account with credentials
    console.log('\n3. Checking admin account with credentials...')
    const accountQuery = `
      SELECT id, "userId", type, provider, "providerAccountId", password
      FROM "Account"
      WHERE "userId" = $1 AND provider = 'credentials'
    `
    const accountResult = await client.query(accountQuery, [user.id])
    
    if (accountResult.rows.length === 0) {
      console.log('❌ No credentials account found for admin user')
      return
    }
    
    const account = accountResult.rows[0]
    console.log('✅ Admin credentials account found:')
    console.log(`   Account ID: ${account.id}`)
    console.log(`   Provider: ${account.provider}`)
    console.log(`   Provider Account ID: ${account.providerAccountId}`)
    console.log(`   Has Password: ${!!account.password}`)

    // Test password verification
    console.log('\n4. Testing password verification...')
    const testPassword = 'HireSense2025!'
    const isValidPassword = await bcrypt.compare(testPassword, account.password)
    console.log(`✅ Password verification: ${isValidPassword ? 'VALID' : 'INVALID'}`)

    // Test the exact query that Prisma would use
    console.log('\n5. Testing Prisma-style query...')
    const prismaStyleQuery = `
      SELECT 
        u.id, u.name, u.email, u.role, u."emailVerified", u."createdAt", u."updatedAt",
        a.id as account_id, a.type, a.provider, a."providerAccountId", a.password
      FROM "User" u
      LEFT JOIN "Account" a ON u.id = a."userId" AND a.provider = 'credentials'
      WHERE u.email = $1
    `
    const prismaResult = await client.query(prismaStyleQuery, ['admin@hiresenseai.com'])
    
    if (prismaResult.rows.length === 0) {
      console.log('❌ Prisma-style query returned no results')
      return
    }
    
    const prismaUser = prismaResult.rows[0]
    console.log('✅ Prisma-style query successful:')
    console.log(`   User Role: ${prismaUser.role}`)
    console.log(`   Account Provider: ${prismaUser.provider}`)
    console.log(`   Has Password: ${!!prismaUser.password}`)

    // Summary
    console.log('\n📋 Authentication Debug Summary:')
    console.log(`   ✅ Database connection: Working`)
    console.log(`   ✅ Admin user exists: ${user.email}`)
    console.log(`   ✅ User role is admin: ${user.role === 'admin'}`)
    console.log(`   ✅ Credentials account exists: Yes`)
    console.log(`   ✅ Password hash exists: Yes`)
    console.log(`   ✅ Password verification: ${isValidPassword ? 'Working' : 'Failed'}`)
    
    if (isValidPassword && user.role === 'admin') {
      console.log('\n🎉 All authentication components are working!')
      console.log('   The issue might be in the Next.js/Prisma integration.')
    } else {
      console.log('\n❌ Authentication issue found!')
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  } finally {
    await client.end()
  }
}

debugAdminAuth()
