import { redirect } from "next/navigation"
import { isAdminRequest } from "@/lib/admin-auth"
import AdminJobsManager from "@/components/admin-jobs-manager"

export default async function AdminPage() {
  if (!(await isAdminRequest())) {
    redirect("/admin/login?from=/admin")
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto">
        <AdminJobsManager />
      </div>
    </main>
  )
}
