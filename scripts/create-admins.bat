@echo off
echo Creating admin users...

echo Creating Himanshu...
node -e "
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe';

async function createUser() {
  const client = new Client({ connectionString, ssl: false });
  try {
    await client.connect();
    await client.query('SET search_path TO \"HireSenseAI_comeballwe\";');
    
    const userId = randomUUID();
    const accountId = randomUUID();
    const hashedPassword = await bcrypt.hash('Himanshu@pseudocoders25', 12);
    
    await client.query('DELETE FROM \"Account\" WHERE \"providerAccountId\" = $1', ['himanshu@hiresense.ai']);
    await client.query('DELETE FROM \"User\" WHERE \"email\" = $1', ['himanshu@hiresense.ai']);
    
    await client.query('INSERT INTO \"User\" (\"id\", \"name\", \"email\", \"role\", \"emailVerified\", \"createdAt\", \"updatedAt\") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [userId, 'Himanshu', 'himanshu@hiresense.ai', 'admin']);
    
    await client.query('INSERT INTO \"Account\" (\"id\", \"userId\", \"type\", \"provider\", \"providerAccountId\", \"password\") VALUES ($1, $2, $3, $4, $5, $6)', [accountId, userId, 'credentials', 'credentials', 'himanshu@hiresense.ai', hashedPassword]);
    
    console.log('Himanshu created successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}
createUser();
"

echo.
echo Admin users creation attempted.
echo Login at: http://localhost:3001/admin/login
echo.
echo Credentials:
echo Email: himanshu@hiresense.ai
echo Password: Himanshu@pseudocoders25
pause
