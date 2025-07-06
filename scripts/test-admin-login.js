/**
 * Test script to verify admin login credentials
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function testAdminLogin() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🧪 Testing admin login credentials...')
    
    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')
    
    // Get admin user and account
    const result = await client.query(`
      SELECT u.id, u.name, u.email, u.role, a.password
      FROM "User" u
      INNER JOIN "Account" a ON u.id = a."userId"
      WHERE u.email = 'admin@hiresenseai.com' AND a.provider = 'credentials'
    `)
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found')
      return
    }
    
    const admin = result.rows[0]
    console.log('✅ Admin user found:')
    console.log(`   📧 Email: ${admin.email}`)
    console.log(`   👤 Name: ${admin.name}`)
    console.log(`   🔐 Role: ${admin.role}`)
    console.log(`   🆔 ID: ${admin.id}`)
    
    // Test password
    const testPassword = 'HireSense2025!'
    const isValidPassword = await bcrypt.compare(testPassword, admin.password)
    
    console.log(`\n🔐 Password test: ${isValidPassword ? '✅ Valid' : '❌ Invalid'}`)
    
    if (isValidPassword) {
      console.log('\n🎉 Admin credentials are working correctly!')
      console.log('\n🚀 You can now login at:')
      console.log('   - Development: http://localhost:3001/admin/login')
      console.log('   - Production: https://your-domain.vercel.app/admin/login')
      console.log('\n🔑 Login with:')
      console.log('   📧 Email: admin@hiresenseai.com')
      console.log('   🔐 Password: HireSense2025!')
    } else {
      console.log('\n❌ Password verification failed')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await client.end()
  }
}

testAdminLogin()
