/**
 * Test the direct admin login function
 */

import { adminLoginDirect } from '@/actions/admin-direct'

async function testDirectLogin() {
  try {
    console.log('🧪 Testing Direct Admin Login...\n')

    console.log('Attempting login with credentials:')
    console.log('Email: admin@hiresenseai.com')
    console.log('Password: HireSense2025!')

    const result = await adminLoginDirect({
      email: 'admin@hiresenseai.com',
      password: 'HireSense2025!'
    })

    console.log('\n📋 Login Result:')
    console.log('Success:', result.success)
    console.log('Message:', result.message)
    
    if (result.success) {
      console.log('✅ Direct admin login is working!')
      console.log('Token generated:', !!result.token)
      console.log('User data:', {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        role: result.user?.role
      })
    } else {
      console.log('❌ Direct admin login failed')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testDirectLogin()
