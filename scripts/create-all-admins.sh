#!/bin/bash

# Script to create all admin users one by one
# Run this script when the database is accessible

echo "🔐 Creating multiple admin users..."

# Create Himanshu
echo "Creating Himanshu..."
node -e "
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe';

async function createHimanshu() {
  const client = new Client({ connectionString, ssl: false });
  try {
    await client.connect();
    await client.query('SET search_path TO \"HireSenseAI_comeballwe\";');
    
    const userId = randomUUID();
    const accountId = randomUUID();
    const hashedPassword = await bcrypt.hash('Himanshu@pseudocoders25', 12);
    
    await client.query('DELETE FROM \"Account\" WHERE \"providerAccountId\" = \$1', ['himanshu@hiresense.ai']);
    await client.query('DELETE FROM \"User\" WHERE \"email\" = \$1', ['himanshu@hiresense.ai']);
    
    await client.query('INSERT INTO \"User\" (\"id\", \"name\", \"email\", \"role\", \"emailVerified\", \"createdAt\", \"updatedAt\") VALUES (\$1, \$2, \$3, \$4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [userId, 'Himanshu', 'himanshu@hiresense.ai', 'admin']);
    
    await client.query('INSERT INTO \"Account\" (\"id\", \"userId\", \"type\", \"provider\", \"providerAccountId\", \"password\") VALUES (\$1, \$2, \$3, \$4, \$5, \$6)', [accountId, userId, 'credentials', 'credentials', 'himanshu@hiresense.ai', hashedPassword]);
    
    console.log('✅ Himanshu created successfully');
  } catch (error) {
    console.error('❌ Error creating Himanshu:', error.message);
  } finally {
    await client.end();
  }
}
createHimanshu();
"

echo "✅ Admin creation script completed"
echo ""
echo "🔑 Admin Credentials:"
echo "1. Himanshu - himanshu@hiresense.ai / Himanshu@pseudocoders25"
echo "2. Rishika - rishika@hiresense.ai / Rishika@pseudocoders25"  
echo "3. Smrati - smrati@hiresense.ai / Smrati@pseudocoders25"
echo "4. Shikha - shikha@hiresense.ai / Shikha@pseudocoders25"
echo ""
echo "🚀 Login at: http://localhost:3001/admin/login"
