"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  subscribeNewsletter,
  type SubscribeState,
} from "@/lib/actions/newsletter";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

function ResultModal({
  open,
  variant,
  title,
  message,
  onClose,
}: {
  open: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
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
            newsletter · {variant === "success" ? "ok" : "error"}
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
          {variant === "success" ? (
            <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
          ) : (
            <span className="mx-auto flex size-10 items-center justify-center border border-danger/50 font-mono text-lg text-danger">
              !
            </span>
          )}
          <div className="space-y-2">
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-sm text-foreground-muted">{message}</p>
          </div>
          <button type="button" onClick={onClose} className="btn text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Newsletter() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(
    subscribeNewsletter,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [modal, setModal] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const lastKey = useRef<string>("");

  useEffect(() => {
    if (state.error) {
      const key = `err:${state.error}`;
      if (lastKey.current === key) return;
      lastKey.current = key;
      setModal({
        variant: "error",
        title: "Invalid email",
        message: state.error,
      });
      return;
    }

    if (state.ok) {
      const key = `ok:${state.alreadySubscribed}:${state.confirmationSent}`;
      if (lastKey.current === key) return;
      lastKey.current = key;
      formRef.current?.reset();
      if (state.alreadySubscribed) {
        setModal({
          variant: "success",
          title: "Already subscribed",
          message: "This email is already on the list. You're all set.",
        });
      } else {
        setModal({
          variant: "success",
          title: "You're on the list",
          message: state.confirmationSent
            ? "Check your inbox for a welcome email. Unsubscribe anytime from the link inside."
            : "Subscription saved. Welcome email will send once SMTP is configured.",
        });
      }
    }
  }, [state]);

  return (
    <section
      id="newsletter"
      className="relative w-full border-t border-border/40 py-8 lg:py-10"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="hero-line-grid absolute inset-0 opacity-20" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        <div className="overflow-hidden rounded-lg border border-border bg-[#0f131a] font-mono shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
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
            <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] text-foreground-muted sm:text-xs">
              newsletter.sh
            </span>
          </div>

          <div className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
            <div className="space-y-2">
              <p className="text-sm text-primary">
                <span className="text-foreground-muted">{"//"}</span> newsletter
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Stay in the loop
                <span className="cursor-blink" aria-hidden />
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
                Occasional notes on projects, shipping updates, and useful
                builds — no spam, unsubscribe anytime.
              </p>
            </div>

            <form
              ref={formRef}
              action={action}
              className="space-y-3"
              noValidate
            >
              <label className="block space-y-1.5">
                <span className="text-xs text-foreground-muted">email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/45 focus:border-primary"
                />
              </label>
              <button
                type="submit"
                disabled={pending}
                className="btn w-full text-sm disabled:pointer-events-none disabled:opacity-55 sm:w-auto"
              >
                {pending ? "$ subscribing…" : "$ subscribe"}
              </button>
              <p className="text-[10px] text-foreground-muted">
                // valid email → welcome mail · invalid → error modal
              </p>
            </form>
          </div>
        </div>
      </div>

      <ResultModal
        open={Boolean(modal)}
        variant={modal?.variant ?? "success"}
        title={modal?.title ?? ""}
        message={modal?.message ?? ""}
        onClose={() => {
          setModal(null);
          lastKey.current = "";
        }}
      />
    </section>
  );
}
