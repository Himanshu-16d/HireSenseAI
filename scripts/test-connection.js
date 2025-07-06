/**
 * Simple script to test database connection and explore available schemas
 */

import { Client } from 'pg'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function testConnection() {
  const client = new Client({
    connectionString,
    ssl: false
  })

  try {
    console.log('📡 Connecting to database...')
    await client.connect()
    console.log('✅ Database connection successful!')

    // Check available schemas
    console.log('\n🔍 Checking available schemas...')
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast') 
      ORDER BY schema_name;
    `)
    
    console.log('Available schemas:')
    schemasResult.rows.forEach(row => {
      console.log(`   📁 ${row.schema_name}`)
    })

    // Check current search path
    console.log('\n🔍 Current search path...')
    const searchPathResult = await client.query('SHOW search_path;')
    console.log(`Search path: ${searchPathResult.rows[0].search_path}`)

    // Check current user
    console.log('\n🔍 Current user...')
    const userResult = await client.query('SELECT current_user;')
    console.log(`Current user: ${userResult.rows[0].current_user}`)

    // Try to create a test table in the user's schema
    console.log('\n🧪 Testing table creation...')
    try {
      await client.query('CREATE TABLE IF NOT EXISTS test_table (id INTEGER);')
      console.log('✅ Can create tables in default schema')
      
      // Clean up
      await client.query('DROP TABLE IF EXISTS test_table;')
    } catch (error) {
      console.log(`❌ Cannot create tables: ${error.message}`)
    }

    // Check if we can list existing tables
    console.log('\n🔍 Existing tables...')
    const tablesResult = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY table_schema, table_name;
    `)
    
    if (tablesResult.rows.length > 0) {
      console.log('Existing tables:')
      tablesResult.rows.forEach(row => {
        console.log(`   🗂️  ${row.table_schema}.${row.table_name}`)
      })
    } else {
      console.log('No existing tables found')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

testConnection()
