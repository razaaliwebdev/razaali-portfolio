"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  submitInquiry,
  type SubmitInquiryState,
} from "@/lib/actions/inquiries";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

function SuccessModal({
  open,
  confirmationSent,
  onClose,
}: {
  open: boolean;
  confirmationSent: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="relative flex items-center border-b border-border bg-[#1a1f2a] px-3 py-2.5">
          <div className="z-10 flex gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.close }}
              aria-hidden
            />
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.minimize }}
              aria-hidden
            />
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.maximize }}
              aria-hidden
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] text-foreground-muted">
            message · delivered
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="relative z-10 ml-auto inline-flex size-7 items-center justify-center text-foreground-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
          <div className="space-y-2">
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              Message received
            </h2>
            <p className="text-sm text-foreground-muted">
              Thanks — your inquiry is in my inbox. I&apos;ll get back to you
              soon.
            </p>
            {confirmationSent ? (
              <p className="font-mono text-xs text-primary">
                ✓ confirmation email sent to your inbox
              </p>
            ) : (
              <p className="font-mono text-xs text-secondary">
                // saved — confirmation email pending SMTP config
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="btn text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactInquiryForm({
  defaultSubject,
  source = "contact",
  sourceRef = "",
}: {
  defaultSubject?: string;
  source?: string;
  sourceRef?: string;
}) {
  const [state, action, pending] = useActionState<
    SubmitInquiryState,
    FormData
  >(submitInquiry, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const lastOk = useRef(false);

  useEffect(() => {
    if (state.ok && !lastOk.current) {
      lastOk.current = true;
      formRef.current?.reset();
      setModalOpen(true);
    }
    if (!state.ok) lastOk.current = false;
  }, [state]);

  return (
    <>
      <form
        ref={formRef}
        action={action}
        className="space-y-5 px-4 py-5 sm:px-5 sm:py-6"
        noValidate
      >
        <input type="hidden" name="source" defaultValue={source} />
        <input type="hidden" name="sourceRef" defaultValue={sourceRef} />

        <p className="text-sm text-foreground-muted">
          Tell me a bit about you and what you have in mind.
        </p>
        {source !== "contact" || sourceRef ? (
          <p className="font-mono text-[11px] text-primary">
            // via {source}
            {sourceRef ? ` · ${sourceRef}` : ""}
          </p>
        ) : null}

        <label className="block space-y-1.5">
          <span className="text-sm text-foreground">Your name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder="e.g. Alex"
            className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-foreground">Your email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-foreground">Subject</span>
          <input
            type="text"
            name="subject"
            defaultValue={defaultSubject}
            placeholder="Project idea, question, hello…"
            className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-foreground">Message</span>
          <textarea
            name="message"
            rows={5}
            required
            placeholder="What would you like to chat about?"
            className="min-h-[8rem] w-full resize-y rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
          />
        </label>

        <div className="min-h-[1.25rem] text-sm" aria-live="polite">
          {state.error ? <p className="text-danger">{state.error}</p> : null}
          {pending ? (
            <p className="font-mono text-secondary">$ sending inquiry…</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
          <p className="max-w-[16rem] text-xs text-foreground-muted">
            Valid emails get a confirmation message. I also get notified in
            admin.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="btn gap-2 text-sm disabled:pointer-events-none disabled:opacity-55"
          >
            {pending ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>

      <SuccessModal
        open={modalOpen}
        confirmationSent={Boolean(state.confirmationSent)}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
