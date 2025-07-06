/**
 * API route for direct admin authentication
 * This bypasses Prisma to avoid the DATABASE_URL issue
 */

import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

const ADMIN_SESSION_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "admin-secret-key"
)

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Connect to database
    await client.connect()
    await client.query('SET search_path TO "HireSenseAI_comeballwe";')

    // Get user and account in one query
    const result = await client.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u."emailVerified", u."createdAt", u."updatedAt",
        a.password
      FROM "User" u
      INNER JOIN "Account" a ON u.id = a."userId"
      WHERE u.email = $1 AND a.provider = 'credentials' AND u.role = 'admin'
    `, [email])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      )
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid admin credentials" },
        { status: 401 }
      )
    }

    // Create admin session token
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      isAdmin: true
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(ADMIN_SESSION_SECRET)

    // Set admin session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    return NextResponse.json({
      success: true,
      message: "Admin login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Direct admin login error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to authenticate admin" },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
