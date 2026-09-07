import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { InquiriesManager } from "@/components/admin/InquiriesManager";
import {
  CmdHeading,
} from "@/components/admin/TerminalUi";
import { listInquiries } from "@/lib/actions/inquiries";

export const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};

export default async function AdminInquiriesPage() {
  const items = await listInquiries();

  return (
    <AdminShell>
      <div className="space-y-6">
        <CmdHeading
          path="inquiries"
          command="ls -lt"
          hint="Contact submissions with status, reply, and archive actions."
        />
        <InquiriesManager items={items} />
      </div>
    </AdminShell>
  );
}
