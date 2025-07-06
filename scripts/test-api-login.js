#!/usr/bin/env node

/**
 * Test the admin login API endpoint directly
 */

async function testApiLogin() {
  try {
    console.log('🔧 Testing admin login API endpoint...')
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hiresenseai.com',
        password: 'HireSense2025!'
      }),
    })
    
    console.log('📊 Response status:', response.status)
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))
    
    const result = await response.json()
    console.log('📊 Response body:', result)
    
    if (result.success) {
      console.log('✅ API login test successful!')
    } else {
      console.log('❌ API login test failed:', result.message)
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message)
    console.error('Full error:', error)
  }
}

testApiLogin()
