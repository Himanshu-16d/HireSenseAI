/**
 * Debug script to check environment variables
 */

console.log('Environment Debug:')
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET)
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET)
console.log('NODE_ENV:', process.env.NODE_ENV)

console.log('\nAll env vars starting with DATABASE:')
Object.keys(process.env)
  .filter(key => key.startsWith('DATABASE'))
  .forEach(key => console.log(`${key}:`, process.env[key]))

console.log('\nAll env vars starting with NEXT:')
Object.keys(process.env)
  .filter(key => key.startsWith('NEXT'))
  .forEach(key => console.log(`${key}:`, process.env[key]))
