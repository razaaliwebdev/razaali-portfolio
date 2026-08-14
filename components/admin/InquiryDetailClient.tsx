"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  replyToInquiry,
  saveInquiryNotes,
  markInquiryStatus,
  deleteInquiry,
  type ReplyInquiryState,
} from "@/lib/actions/inquiries";
import type { Inquiry, InquiryReply, InquiryStatus } from "@/db/schema";
import {
  adminFieldClass,
  adminLabelClass,
  StatusBadge,
  TerminalPanel,
} from "@/components/admin/TerminalUi";

export function InquiryReplyForm({ inquiry }: { inquiry: Inquiry }) {
  const [state, action, pending] = useActionState<ReplyInquiryState, FormData>(
    replyToInquiry,
    {},
  );
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (state.ok && !done.current) {
      done.current = true;
      router.refresh();
    }
    if (!state.ok) done.current = false;
  }, [state, router]);

  return (
    <TerminalPanel title="mail · compose" bodyClassName="space-y-4 p-4">
      <form action={action} className="space-y-4">
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        <label className={adminLabelClass}>
          <span>Subject</span>
          <input
            name="subject"
            required
            defaultValue={`Re: ${inquiry.subject}`}
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Body</span>
          <textarea
            name="body"
            required
            rows={8}
            defaultValue={`Hi ${inquiry.name.split(/\s+/)[0]},\n\nThanks for reaching out.\n\n\n\nBest,\nRaza Ali\nhttps://razaali.dev`}
            className={`${adminFieldClass} min-h-[10rem] resize-y`}
          />
        </label>
        {state.error ? (
          <p className="text-sm text-danger">{state.error}</p>
        ) : null}
        {state.ok ? (
          <p className="font-mono text-sm text-primary">✓ mail sent</p>
        ) : null}
        <button type="submit" disabled={pending} className="btn text-sm">
          {pending ? "Sending…" : "Send reply"}
        </button>
      </form>
    </TerminalPanel>
  );
}

export function InquiryNotesForm({ inquiry }: { inquiry: Inquiry }) {
  const [notes, setNotes] = useState(inquiry.adminNotes);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <TerminalPanel title="notes · private" bodyClassName="p-4">
      <div className="space-y-3">
        <label className={adminLabelClass}>
          <span>Admin notes</span>
          <textarea
            name="notes"
            rows={4}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setSaved(false);
            }}
            className={`${adminFieldClass} resize-y`}
          />
        </label>
        <button
          type="button"
          disabled={pending}
          className="btn text-sm"
          onClick={() => {
            startTransition(async () => {
              await saveInquiryNotes(inquiry.id, notes);
              setSaved(true);
            });
          }}
        >
          {pending ? "Saving…" : "Save notes"}
        </button>
        {saved ? (
          <p className="font-mono text-xs text-primary">✓ notes saved</p>
        ) : null}
      </div>
    </TerminalPanel>
  );
}

export function InquiryActions({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function setStatus(status: InquiryStatus) {
    startTransition(async () => {
      await markInquiryStatus(inquiry.id, status);
      router.refresh();
    });
  }

  function onDelete() {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    startTransition(async () => {
      await deleteInquiry(inquiry.id);
      router.push("/admin/inquiries");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="border border-border px-3 py-1.5 font-mono text-xs text-foreground-muted hover:border-secondary hover:text-secondary"
        onClick={() => setStatus("read")}
      >
        mark read
      </button>
      <button
        type="button"
        className="border border-border px-3 py-1.5 font-mono text-xs text-foreground-muted hover:border-tertiary hover:text-tertiary"
        onClick={() => setStatus("replied")}
      >
        mark replied
      </button>
      <button
        type="button"
        className="border border-border px-3 py-1.5 font-mono text-xs text-foreground-muted hover:border-border hover:text-foreground"
        onClick={() => setStatus("archived")}
      >
        archive
      </button>
      <button
        type="button"
        className="border border-border px-3 py-1.5 font-mono text-xs text-danger hover:border-danger"
        onClick={onDelete}
      >
        delete
      </button>
      <Link
        href="/admin/inquiries"
        className="border border-border px-3 py-1.5 font-mono text-xs text-foreground-muted hover:border-primary hover:text-primary"
      >
        back
      </Link>
      <StatusBadge status={inquiry.status} />
    </div>
  );
}

export function InquiryRepliesList({ replies }: { replies: InquiryReply[] }) {
  if (!replies.length) {
    return (
      <p className="font-mono text-sm text-foreground-muted">
        // no outbound replies yet
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {replies.map((reply) => (
        <li key={reply.id} className="border border-border bg-[#0b0e14] p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-primary">{reply.subject}</p>
            <time className="font-mono text-[10px] text-foreground-muted">
              {new Date(reply.sentAt).toLocaleString()}
            </time>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-foreground-muted">
            {reply.body}
          </pre>
        </li>
      ))}
    </ul>
  );
}
