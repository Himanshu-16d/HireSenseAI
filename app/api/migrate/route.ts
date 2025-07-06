import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// This API route is for running database migrations on Vercel
// Only run this ONCE after initial deployment
export async function POST(request: NextRequest) {
  try {
    // Verify this is being called from a secure context
    const authHeader = request.headers.get('authorization')
    const migrationKey = process.env.MIGRATION_SECRET
    
    if (!migrationKey || authHeader !== `Bearer ${migrationKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Test database connection
    await prisma.$connect()
    console.log('Database connected successfully')

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `
    
    console.log('Existing tables:', tables)

    // The migration will be handled by Prisma during build
    // This endpoint is just for verification and manual checks
    
    return NextResponse.json({
      success: true,
      message: 'Database connection verified',
      tables: tables
    })
    
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Health check for the migration endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Migration endpoint is available',
    timestamp: new Date().toISOString()
  })
}
