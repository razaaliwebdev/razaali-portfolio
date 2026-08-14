import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  CmdHeading,
  StatusBadge,
  TerminalPanel,
} from "@/components/admin/TerminalUi";
import { listInquiries } from "@/lib/actions/inquiries";

export const metadata: Metadata = {
  title: "Inquiries | Admin",
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

        <TerminalPanel title="inbox" bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
              <tr>
                <th className="px-3 py-2 font-medium">from</th>
                <th className="px-3 py-2 font-medium">subject</th>
                <th className="px-3 py-2 font-medium">status</th>
                <th className="px-3 py-2 font-medium">when</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 font-mono text-foreground-muted"
                  >
                    // inbox empty
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/60 hover:bg-white/[0.02]"
                  >
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/inquiries/${item.id}`}
                        className="block"
                      >
                        <p className="text-foreground">{item.name}</p>
                        <p className="font-mono text-[11px] text-foreground-muted">
                          {item.email}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/inquiries/${item.id}`}
                        className="text-foreground hover:text-primary"
                      >
                        {item.subject}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-foreground-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TerminalPanel>
      </div>
    </AdminShell>
  );
}
