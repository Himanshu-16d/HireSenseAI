import { redirect } from "next/navigation"
import { verifyAdminSession } from "@/actions/admin-actions"
import ComprehensiveAdminDashboard from "@/components/comprehensive-admin-dashboard"

export default async function AdminPage() {
  // Verify admin session
  const adminSession = await verifyAdminSession()
  
  if (!adminSession.success) {
    redirect("/admin/login")
  }

  return (
    <ComprehensiveAdminDashboard 
      adminSession={{
        userId: adminSession.userId!,
        email: adminSession.email!,
        role: adminSession.role!,
        isAdmin: adminSession.isAdmin!
      }} 
    />
  )
}
