import { requireAdmin } from "@/lib/actions/auth";
import AdminFrame from "@/components/admin/AdminFrame";

export async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminFrame email={session.email}>{children}</AdminFrame>;
}
