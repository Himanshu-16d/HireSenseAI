#!/usr/bin/env node

/**
 * Test admin login through the web interface
 */

import { JSDOM } from 'jsdom'

async function testWebLogin() {
  try {
    console.log('🔧 Testing admin login via web interface...')
    
    // Test the login form submission
    const formData = {
      email: 'admin@hiresenseai.com',
      password: 'HireSense2025!'
    }
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    
    console.log('📊 Response status:', response.status)
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))
    
    const result = await response.json()
    console.log('📊 Response body:', result)
    
    if (result.success) {
      console.log('✅ Admin login via web interface successful!')
      
      // Check if we got the admin session cookie
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader && setCookieHeader.includes('admin-session=')) {
        console.log('✅ Admin session cookie set correctly')
        
        // Extract the cookie for testing access to admin pages
        const cookies = setCookieHeader.split(';')[0] // Get the first cookie
        console.log('🍪 Session cookie:', cookies)
        
        // Test access to admin dashboard with the cookie
        console.log('🔧 Testing admin dashboard access...')
        
        const dashboardResponse = await fetch('http://localhost:3000/admin', {
          headers: {
            'Cookie': cookies
          }
        })
        
        console.log('📊 Dashboard response status:', dashboardResponse.status)
        
        if (dashboardResponse.status === 200) {
          console.log('✅ Admin dashboard accessible with session!')
        } else if (dashboardResponse.status === 302 || dashboardResponse.status === 307) {
          console.log('📍 Dashboard redirecting (expected if auth middleware is working)')
        } else {
          console.log('❌ Dashboard access failed')
        }
      } else {
        console.log('❌ No admin session cookie found in response')
      }
    } else {
      console.log('❌ Admin login via web interface failed:', result.message)
    }
    
  } catch (error) {
    console.error('❌ Web login test error:', error.message)
    console.error('Full error:', error)
  }
}

testWebLogin()
