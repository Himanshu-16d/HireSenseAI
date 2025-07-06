"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"

export async function updateUserRole(role: "recruiter" | "candidate") {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return { success: false, message: "Not authenticated" }
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { role }
    })

    return { success: true, message: "Role updated successfully" }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, message: "Failed to update role" }
  }
}
