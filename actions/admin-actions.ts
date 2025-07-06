"use server"

import { prisma } from "@/lib/db"
import bcryptjs from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const ADMIN_SESSION_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "admin-secret-key"
)

export async function adminLogin(data: {
  email: string
  password: string
}) {
  try {
    // Check if user exists and is an admin
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        accounts: {
          where: {
            provider: "credentials"
          }
        }
      }
    })

    if (!user || user.role !== "admin") {
      return { success: false, message: "Invalid admin credentials" }
    }

    if (!user.accounts[0]?.password) {
      return { success: false, message: "Invalid admin credentials" }
    }

    // Verify password
    const isValid = await bcryptjs.compare(data.password, user.accounts[0].password)
    
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

    // Set admin session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    return {
      success: true,
      message: "Admin login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return { success: false, message: "Failed to authenticate admin" }
  }
}

export async function verifyAdminSession() {
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
    console.error("Admin session verification error:", error)
    return { success: false, message: "Session verification failed" }
  }
}

export async function adminLogout() {
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
    console.error("Admin logout error:", error)
    return { success: false, message: "Failed to logout" }
  }
}

export async function createRecruiterAccount(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  companyName?: string
}) {
  try {
    // Verify admin session
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return { success: false, message: "Admin authentication required" }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10)

    // Create user and credentials account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with recruiter role
      const user = await tx.user.create({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          role: "recruiter",
        },
      })

      // Create credentials account with hashed password
      await tx.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id,
          password: hashedPassword,
        },
      })

      return user
    })

    return {
      success: true,
      message: "Recruiter account created successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    }
  } catch (error) {
    console.error("Error creating recruiter account:", error)
    return { success: false, message: "Failed to create recruiter account" }
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            type: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'candidate',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        authProviders: user.accounts.map(acc => acc.provider).join(', ')
      }))
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Failed to fetch users", users: [] }
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete associated accounts first
      await tx.account.deleteMany({
        where: { userId }
      })
      
      // Delete sessions
      await tx.session.deleteMany({
        where: { userId }
      })
      
      // Delete user
      await tx.user.delete({
        where: { id: userId }
      })
    })

    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}

export async function updateUserRole(userId: string, newRole: "admin" | "recruiter" | "candidate") {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    return { success: true, message: "User role updated successfully" }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, message: "Failed to update user role" }
  }
}
