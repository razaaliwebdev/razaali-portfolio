import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { CmdHeading } from "@/components/admin/TerminalUi";
import { listServices } from "@/lib/actions/services";

export const metadata: Metadata = {
  title: "Services | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const items = await listServices();

  return (
    <AdminShell>
      <div className="space-y-6">
        <CmdHeading
          path="services"
          command="crud --publish"
          hint="Manage service offerings shown on the portfolio."
        />
        <ServicesManager items={items} />
      </div>
    </AdminShell>
  );
}
