import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { NewsletterManager } from "@/components/admin/NewsletterManager";
import { CmdHeading } from "@/components/admin/TerminalUi";
import {
  getNewsletterStats,
  listNewsletterCampaigns,
  listNewsletterSubscribers,
} from "@/lib/actions/newsletter";

export const metadata: Metadata = {
  title: "Newsletter",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const [subscribers, campaigns, stats] = await Promise.all([
    listNewsletterSubscribers(),
    listNewsletterCampaigns(),
    getNewsletterStats(),
  ]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <CmdHeading
          path="newsletter"
          command="broadcast --active"
          hint="Manage subscribers and send cold updates to the list."
        />
        <NewsletterManager
          subscribers={subscribers}
          campaigns={campaigns}
          stats={stats}
        />
      </div>
    </AdminShell>
  );
}
