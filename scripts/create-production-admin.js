/**
 * Production Admin Setup Script
 * Run this after successful Vercel deployment to create initial admin user
 * Usage: node scripts/create-production-admin.js
 */

import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

function hideInput(query) {
  return new Promise((resolve) => {
    process.stdout.write(query)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    
    let input = ''
    process.stdin.on('data', function (char) {
      char = char + ''
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdout.write('\n')
          resolve(input)
          break
        case '\u0003':
          process.exit()
          break
        default:
          input += char
          break
      }
    })
  })
}

async function createProductionAdmin() {
  try {
    console.log('🚀 Production Admin Setup for HireSenseAI')
    console.log('=========================================')
    
    // Check database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email)
      const overwrite = await question('Do you want to create another admin? (y/N): ')
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Admin setup cancelled.')
        return
      }
    }
    
    // Get admin details
    console.log('\n📝 Enter admin user details:')
    const name = await question('Full Name: ')
    const email = await question('Email: ')
    const password = await hideInput('Password: ')
    
    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw new Error(`User with email ${email} already exists`)
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12)
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name,
        email,
        role: 'admin',
        emailVerified: new Date(),
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
            password: hashedPassword
          }
        }
      }
    })
    
    console.log('\n✅ Admin user created successfully!')
    console.log('👤 Admin Details:')
    console.log(`   Name: ${adminUser.name}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   ID: ${adminUser.id}`)
    
    console.log('\n🎉 Production setup complete!')
    console.log('You can now login with the admin credentials.')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

// Verify environment
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required')
  process.exit(1)
}

if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️  Warning: Not running in production environment')
}

createProductionAdmin()
