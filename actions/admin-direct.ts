/**
 * Alternative admin authentication using direct database connection
 * This bypasses Prisma to avoid the DATABASE_URL issue
 */

import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const connectionString = 'postgresql://HireSenseAI_comeballwe:badd362df4673b12c03e39c9cdbe4eff4040527a@bauli.h.filess.io:5434/HireSenseAI_comeballwe'

const ADMIN_SESSION_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "admin-secret-key"
)

export async function adminLoginDirect(data: {
  email: string
  password: string
}) {
  const client = new Client({
    connectionString,
    ssl: false,
    searchPath: ['HireSenseAI_comeballwe']
  })

  try {
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
    `, [data.email])

    if (result.rows.length === 0) {
      return { success: false, message: "Invalid admin credentials" }
    }

    const user = result.rows[0]

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.password)
    
    if (!isValid) {
      return { success: false, message: "Invalid admin credentials" }
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

    return {
      success: true,
      message: "Admin login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  } catch (error) {
    console.error("Direct admin login error:", error)
    return { success: false, message: "Failed to authenticate admin" }
  } finally {
    await client.end()
  }
}

export async function verifyAdminSessionDirect() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin-session")
    
    if (!sessionCookie?.value) {
      return { success: false, message: "No admin session found" }
    }

    const { payload } = await jwtVerify(sessionCookie.value, ADMIN_SESSION_SECRET)
    
    if (payload.role !== "admin" || !payload.isAdmin) {
      return { success: false, message: "Invalid admin session" }
    }

    return {
      success: true,
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      isAdmin: payload.isAdmin as boolean
    }
  } catch (error) {
    console.error("Direct admin session verification error:", error)
    return { success: false, message: "Session verification failed" }
  }
}

export async function adminLogoutDirect() {
  try {
    const cookieStore = await cookies()
    cookieStore.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    })
    return { success: true, message: "Admin logged out successfully" }
  } catch (error) {
    console.error("Direct admin logout error:", error)
    return { success: false, message: "Failed to logout admin" }
  }
}
