import { getAllUsers, getCurrentUserProfile } from "@/lib/data/users";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsersClient } from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: any[] = [];
  let currentRole: any = null;
  let errorNotice: string | null = null;

  try {
    const userResult = await getAllUsers();
    users = userResult.users;
    const currentProfile = await getCurrentUserProfile();
    currentRole = currentProfile?.role || null;
  } catch (err: any) {
    errorNotice = err.message;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Admin Users & Role Control"
        description="Manage privileged operators, assign Super Admin/Admin/Editor roles, and govern portal access."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
      />

      {errorNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <span>{errorNotice}</span>
        </div>
      )}

      <UsersClient initialUsers={users} currentUserRole={currentRole} />
    </AdminLayout>
  );
}
