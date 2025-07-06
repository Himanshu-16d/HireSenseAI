/**
 * Simple database connection test
 */

import { Client } from 'pg'

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

async function testConnection() {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    console.log('Testing database connection...')
    await client.connect()
    console.log('✅ Connected to database successfully')
    
    const result = await client.query('SELECT COUNT(*) FROM "User"')
    console.log(`✅ Found ${result.rows[0].count} users in database`)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await client.end()
    console.log('Connection closed')
  }
}

testConnection()
