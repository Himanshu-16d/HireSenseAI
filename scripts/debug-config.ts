import { config, validateConfig } from '@/lib/config'
import { configDotenv } from 'dotenv'

// Explicitly load environment variables
configDotenv()

console.log('=== Environment Debug ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL value:', process.env.DATABASE_URL)
console.log('DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql://'))
console.log('Config database url:', config.database.url)
console.log('Config database url starts with postgresql:', config.database.url?.startsWith('postgresql://'))

try {
  validateConfig()
  console.log('✅ Config validation passed')
} catch (error) {
  console.log('❌ Config validation failed:', (error as Error).message)
}
