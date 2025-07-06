import { redirect } from "next/navigation"
import { verifyAdminSession } from "@/actions/admin-actions"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  // Verify admin session
  const adminSession = await verifyAdminSession()
  
  if (!adminSession.success) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
