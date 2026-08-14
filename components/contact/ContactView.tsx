"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";

const EMAIL = "razaali.webdev@gmail.com";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL = [
  {
    label: "GitHub",
    href: "https://github.com/razaaliwebdev",
    Icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/razaaliwebdev/",
    Icon: LinkedInIcon,
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    Icon: Mail,
  },
] as const;

const DETAILS = [
  {
    label: "Email",
    value: (
      <a
        href={`mailto:${EMAIL}`}
        className="break-all text-primary transition-colors hover:text-primary-bright"
      >
        {EMAIL}
      </a>
    ),
  },
  { label: "Based in", value: "Lahore, Pakistan · Remote OK" },
  { label: "Timezone", value: "Pakistan Standard Time (UTC+5)" },
  {
    label: "Availability",
    value: (
      <span className="inline-flex items-center gap-2 text-primary">
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
        Open to new work
      </span>
    ),
  },
] as const;

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!name.trim()) return "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!message.trim() || message.trim().length < 8) {
      return "Please write a short message (at least a sentence).";
    }
    return null;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("sending");

    const subject = encodeURIComponent(`Message from ${name.trim()}`);
    const body = encodeURIComponent(
      `Hi Raza,\n\n${message.trim()}\n\n— ${name.trim()}\n${email.trim()}\n`,
    );

    window.setTimeout(() => {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 500);
  }

  return (
    <section className="relative w-full py-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* Left — friendly intro */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-sm text-primary">
                <span className="text-foreground-muted">{"//"}</span> Contact
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Let&apos;s talk
                <span className="cursor-blink" aria-hidden />
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-foreground-muted sm:text-[15px]">
                Have a project idea, a question, or just want to say hello?
                Fill out the form — I&apos;ll get back to you as soon as I can.
              </p>
            </div>

            <div className="overflow-hidden rounded-md border border-border bg-background-panel">
              <div className="border-b border-border bg-[#1a1f2a] px-3 py-2 font-mono text-[11px] text-foreground-muted">
                How to reach me
              </div>
              <dl className="divide-y divide-border/60 text-sm">
                {DETAILS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6.5rem_1fr] gap-3 px-3 py-3 sm:grid-cols-[7.5rem_1fr]"
                  >
                    <dt className="text-foreground-muted">{row.label}</dt>
                    <dd className="min-w-0 text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className="mb-2 text-xs text-foreground-muted">
                Or find me online
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-[#0f131a] px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-tertiary transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to home
            </Link>
          </div>

          {/* Right — friendly form, light terminal chrome */}
          <div className="min-w-0 overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
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
                Send a message
              </span>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-5 px-4 py-5 sm:px-5 sm:py-6"
              noValidate
            >
              <p className="text-sm text-foreground-muted">
                Tell me a bit about you and what you have in mind.
              </p>

              <label className="block space-y-1.5">
                <span className="text-sm text-foreground">Your name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-foreground">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to chat about?"
                  className="min-h-[8rem] w-full resize-y rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
                />
              </label>

              <div
                className="min-h-[1.25rem] text-sm"
                aria-live="polite"
              >
                {status === "error" && error && (
                  <p className="text-danger">{error}</p>
                )}
                {status === "sending" && (
                  <p className="text-secondary">Opening your email app…</p>
                )}
                {status === "sent" && (
                  <p className="text-primary">
                    Almost done — finish sending in your email app. Thanks!
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
                <p className="max-w-[14rem] text-xs text-foreground-muted">
                  This opens your email app with the message ready to send.
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn gap-2 text-sm disabled:pointer-events-none disabled:opacity-55"
                >
                  <Send className="size-3.5" aria-hidden />
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
