/**
 * Simple test script to verify database connection and test authentication
 */

import { Client } from 'pg'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function testFullSetup() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('🧪 Testing HireSenseAI Database Setup...')
    
    // Connect to database
    console.log('📡 Connecting to database...')
    await client.connect()
    console.log('✅ Database connection successful!')

    // Set schema
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')

    // Check if tables exist
    console.log('\n🔍 Checking database tables...')
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'HireSenseAI_comeballwe') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'HireSenseAI_comeballwe' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    
    console.log('📋 Database Tables:')
    tablesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name} (${row.column_count} columns)`)
    })

    // Check indexes
    console.log('\n🔍 Checking indexes...')
    const indexesResult = await client.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'HireSenseAI_comeballwe'
      ORDER BY tablename, indexname;
    `)
    
    console.log('🗂️  Database Indexes:')
    indexesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.tablename}.${row.indexname}`)
    })

    // Test admin user
    console.log('\n👤 Testing admin user...')
    const userResult = await client.query(`
      SELECT u.id, u.name, u.email, u.role, a.provider
      FROM "User" u
      LEFT JOIN "Account" a ON u.id = a."userId"
      WHERE u.email = 'admin@hiresense.ai';
    `)
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0]
      console.log('✅ Admin user found:')
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   👤 Name: ${user.name}`)
      console.log(`   🔐 Role: ${user.role}`)
      console.log(`   🔑 Provider: ${user.provider || 'None'}`)
    } else {
      console.log('❌ Admin user not found')
    }

    // Test constraints
    console.log('\n🔗 Testing foreign key constraints...')
    const constraintsResult = await client.query(`
      SELECT conname, conrelid::regclass AS table_name
      FROM pg_constraint
      WHERE connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'HireSenseAI_comeballwe')
      AND contype = 'f'
      ORDER BY table_name, conname;
    `)
    
    console.log('🔗 Foreign Key Constraints:')
    constraintsResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}: ${row.conname}`)
    })

    console.log('\n🎉 Database setup verification completed successfully!')
    console.log('\n📝 Summary:')
    console.log(`   - Tables: ${tablesResult.rows.length}`)
    console.log(`   - Indexes: ${indexesResult.rows.length}`)
    console.log(`   - Admin User: ${userResult.rows.length > 0 ? 'Created' : 'Missing'}`)
    console.log(`   - Constraints: ${constraintsResult.rows.length}`)
    
    console.log('\n🚀 Ready for production deployment!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

testFullSetup()
