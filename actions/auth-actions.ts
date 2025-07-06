"use server"

import { prisma } from "@/lib/db"
import bcryptjs from "bcryptjs"

export async function registerUser(data: {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: string
}) {
  try {
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
      // Create user
      const user = await tx.user.create({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          role: data.role || "candidate",
        },
      })

      // Create credentials account with hashed password
      await tx.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id, // Using user.id as providerAccountId for credentials
          password: hashedPassword,
        },
      })

      return user
    })

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, message: "Failed to create account" }
  }
}