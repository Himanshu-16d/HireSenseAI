import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Health check endpoint for Vercel deployment
export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Basic environment checks
    const hasRequiredEnvVars = !!(
      process.env.DATABASE_URL &&
      process.env.NEXTAUTH_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
    )
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: hasRequiredEnvVars ? 'configured' : 'missing variables',
      message: 'All systems operational'
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'System check failed'
    }, { 
      status: 500 
    })
  } finally {
    await prisma.$disconnect()
  }
}
