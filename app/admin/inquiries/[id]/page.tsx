import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  InquiryActions,
  InquiryNotesForm,
  InquiryRepliesList,
  InquiryReplyForm,
} from "@/components/admin/InquiryDetailClient";
import { CmdHeading, TerminalPanel } from "@/components/admin/TerminalUi";
import { getInquiry, openInquiryIfNew } from "@/lib/actions/inquiries";
import { formatInquirySource } from "@/lib/inquiry-source";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getInquiry(id);
  if (!data) {
    return {
      title: "Inquiry not found",
      robots: { index: false, follow: false },
    };
  }
  const subject = data.inquiry.subject?.trim() || "Inquiry";
  return {
    title: subject.slice(0, 60),
    description: `Admin inquiry from ${data.inquiry.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getInquiry(id);
  if (!data) notFound();

  await openInquiryIfNew(id);
  const refreshed = (await getInquiry(id)) ?? data;
  const { inquiry, replies } = refreshed;
  const sourceLabel = formatInquirySource(inquiry.source, inquiry.sourceRef);

  return (
    <AdminShell>
      <div className="space-y-6">
        <CmdHeading
          path={`inquiries/${inquiry.id.slice(0, 8)}`}
          command="cat message.txt"
          hint={`${inquiry.name} · ${inquiry.email} · ${sourceLabel}`}
        />

        <InquiryActions inquiry={inquiry} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <TerminalPanel title="message" bodyClassName="space-y-3 p-4">
            <p className="font-mono text-xs text-primary">{inquiry.subject}</p>
            <p className="font-mono text-[11px] text-tertiary">
              source · {sourceLabel}
            </p>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
              {inquiry.message}
            </pre>
            <p className="font-mono text-[11px] text-foreground-muted">
              received {new Date(inquiry.createdAt).toLocaleString()}
              {inquiry.confirmationSentAt
                ? ` · confirmation mailed ${new Date(inquiry.confirmationSentAt).toLocaleString()}`
                : " · confirmation not sent"}
            </p>
          </TerminalPanel>

          <div className="space-y-4">
            <InquiryReplyForm inquiry={inquiry} />
            <InquiryNotesForm inquiry={inquiry} />
          </div>
        </div>

        <TerminalPanel title="sent · history" bodyClassName="p-4">
          <InquiryRepliesList replies={replies} />
        </TerminalPanel>
      </div>
    </AdminShell>
  );
}
