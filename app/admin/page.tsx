import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin-auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const token = cookies().get("admin_session")?.value;
  if (!verifyAdminToken(token)) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
