import { requireAdmin } from "@/lib/actions/auth";
import { getAdminNotifications } from "@/lib/actions/notifications";
import AdminFrame from "@/components/admin/AdminFrame";

export async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  let unreadInquiries = 0;
  try {
    const notes = await getAdminNotifications();
    unreadInquiries = notes.unreadCount;
  } catch {
    unreadInquiries = 0;
  }

  return (
    <AdminFrame email={session.email} unreadInquiries={unreadInquiries}>
      {children}
    </AdminFrame>
  );
}
