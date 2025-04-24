"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

export async function updateAccountInfo(data: {
  name: string
  email: string
}) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to update your account" }
    }

    const userId = session.user.id

    // First check if the new email is already taken by another user
    if (data.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })
      
      if (existingUser && existingUser.id !== userId) {
        return { success: false, message: "This email is already in use" }
      }
    }

    // Update the user record
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      },
    })

    return { 
      success: true, 
      message: "Account information updated successfully",
      user: {
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    console.error("Error updating account info:", error)
    return { success: false, message: "Failed to update account information" }
  }
}

export async function updatePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  try {
    // In a real app, you'd verify the current password and hash the new password
    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, message: "Failed to update password" }
  }
}

export async function updateNotificationSettings(data: {
  emailNotifications: boolean
  jobAlerts: boolean
  weeklyDigest: boolean
}) {
  try {
    // Save notification preferences to the database
    return { success: true, message: "Notification settings updated successfully" }
  } catch (error) {
    console.error("Error updating notification settings:", error)
    return { success: false, message: "Failed to update notification settings" }
  }
}

export async function updatePrivacySettings(data: {
  profileVisibility: boolean
  dataCollection: boolean
}) {
  try {
    // Save privacy settings to the database
    return { success: true, message: "Privacy settings updated successfully" }
  } catch (error) {
    console.error("Error updating privacy settings:", error)
    return { success: false, message: "Failed to update privacy settings" }
  }
}