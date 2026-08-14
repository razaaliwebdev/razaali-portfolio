import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Raza Ali",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  return (
    <AdminShell>
      <section className="space-y-4 rounded-md border border-border bg-[#0f131a] p-5">
        <h2 className="text-base font-semibold text-foreground">Dashboard</h2>
        <p className="text-sm text-foreground-muted">
          You&apos;re signed in. This console will manage contact inquiries,
          services, and more portfolio content.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="border border-border bg-[#0b0e14] p-4">
            <p className="text-xs text-foreground-muted">Inquiries</p>
            <p className="mt-1 text-2xl font-semibold text-primary">—</p>
            <p className="mt-1 text-xs text-foreground-muted">Coming next</p>
          </div>
          <div className="border border-border bg-[#0b0e14] p-4">
            <p className="text-xs text-foreground-muted">Services</p>
            <p className="mt-1 text-2xl font-semibold text-secondary">—</p>
            <p className="mt-1 text-xs text-foreground-muted">Coming next</p>
          </div>
          <div className="border border-border bg-[#0b0e14] p-4">
            <p className="text-xs text-foreground-muted">Admins</p>
            <p className="mt-1 text-2xl font-semibold text-tertiary">DB</p>
            <p className="mt-1 text-xs text-foreground-muted">Seeded in Neon</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
