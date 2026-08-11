"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Send, Terminal } from "lucide-react";

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

type FieldName = "name" | "email" | "message";

function PromptLabel({ children }: { children: string }) {
  return (
    <span className="shrink-0 select-none">
      <span className="text-primary">visitor@razaali.dev</span>
      <span className="text-foreground-muted">:~$</span>{" "}
      <span className="text-tertiary">{children}</span>{" "}
      <span className="text-foreground-muted">&gt;</span>
    </span>
  );
}

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState<FieldName | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const loginLine = useMemo(() => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  function validate() {
    if (!name.trim()) return "name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "valid email is required";
    }
    if (!message.trim() || message.trim().length < 8) {
      return "message must be at least 8 characters";
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

    const subject = encodeURIComponent(`Portfolio contact — ${name.trim()}`);
    const body = encodeURIComponent(
      `name: ${name.trim()}\nemail: ${email.trim()}\n\n${message.trim()}\n`,
    );

    window.setTimeout(() => {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 650);
  }

  return (
    <section className="relative w-full py-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* Left — connection brief */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-sm text-primary">
                <span className="text-foreground-muted">{"//"}</span> 07. Get In
                Touch
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Initialize Connection
                <span className="cursor-blink" aria-hidden />
              </h1>
              <p className="max-w-md font-mono text-sm leading-relaxed text-foreground-muted">
                Open to collaborations, freelance work, and conversations about
                full-stack product engineering.
              </p>
            </div>

            {/* Key / Value table */}
            <div className="overflow-hidden border border-border bg-background-panel">
              <div className="grid grid-cols-[7rem_1fr] border-b border-border bg-[#1a1f2a] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground-muted sm:grid-cols-[8rem_1fr] sm:text-[11px]">
                <span>Key</span>
                <span>Value</span>
              </div>
              <dl className="divide-y divide-border/60 font-mono text-[12px] sm:text-[13px]">
                <div className="grid grid-cols-[7rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-[#d4bfff]">email</dt>
                  <dd>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="break-all text-primary transition-colors hover:text-primary-bright"
                    >
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-[#d4bfff]">location</dt>
                  <dd className="text-foreground">Lahore, PK · Remote</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-[#d4bfff]">timezone</dt>
                  <dd className="text-foreground">UTC+5</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
                  <dt className="text-[#d4bfff]">status</dt>
                  <dd className="inline-flex items-center gap-2 text-primary">
                    <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                    online
                  </dd>
                </div>
              </dl>
            </div>

            {/* Social — square borders like site secondary CTAs */}
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
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center border border-border bg-[#0f131a] text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>

            <p className="font-mono text-[11px] text-foreground-muted">
              <Link
                href="/"
                className="text-tertiary transition-colors hover:text-primary"
              >
                cd ../
              </Link>{" "}
              · return home
            </p>
          </div>

          {/* Right — terminal form */}
          <div className="min-w-0 overflow-hidden border border-border bg-[#0f131a] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
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
              <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-foreground-muted sm:text-xs">
                visitor@razaali.dev:~/contact.cmd
              </span>
              <span className="ml-auto hidden items-center gap-1 font-mono text-[10px] text-foreground-muted sm:inline-flex">
                <Terminal className="size-3 text-primary" aria-hidden />
                tty
              </span>
            </div>

            <form
              onSubmit={onSubmit}
              className="space-y-4 px-3 py-4 font-mono text-[12px] sm:space-y-5 sm:px-5 sm:py-5 sm:text-[13px]"
              noValidate
            >
              <div className="space-y-1 text-foreground-muted">
                <p>Last login: {loginLine} on ttys001</p>
                <p>
                  Welcome to{" "}
                  <span className="text-foreground">razaali.dev</span>{" "}
                  <span className="text-secondary">v2.0</span>.
                </p>
                <p>
                  <span className="text-primary">$</span> ./message.sh{" "}
                  <span className="text-secondary">--init</span>
                </p>
                <p># Executing secure messaging protocol…</p>
              </div>

              <label className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-2">
                <PromptLabel>name</PromptLabel>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setActive("name")}
                  onBlur={() => setActive(null)}
                  placeholder="Enter your name"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-foreground-muted/50 focus:ring-0"
                />
                {active === "name" && (
                  <span className="hidden text-primary sm:inline" aria-hidden>
                    ▊
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-2">
                <PromptLabel>email</PromptLabel>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActive("email")}
                  onBlur={() => setActive(null)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-foreground-muted/50 focus:ring-0"
                />
                {active === "email" && (
                  <span className="hidden text-primary sm:inline" aria-hidden>
                    ▊
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <PromptLabel>message</PromptLabel>
                <textarea
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setActive("message")}
                  onBlur={() => setActive(null)}
                  placeholder="Type your message…"
                  className="mt-1 min-h-[7rem] w-full resize-y border border-border bg-[#0b0e14] px-3 py-2 text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
                />
              </label>

              <div
                className="min-h-[1.25rem] font-mono text-[11px] sm:text-xs"
                aria-live="polite"
              >
                {status === "error" && error && (
                  <p className="text-danger"># error: {error}</p>
                )}
                {status === "sending" && (
                  <p className="text-secondary"># packing payload…</p>
                )}
                {status === "sent" && (
                  <p className="text-primary">
                    ✓ exit 0 — mail client opened. Talk soon.
                  </p>
                )}
                {status === "idle" && active === null && (
                  <p className="text-foreground-muted">
                    <span className="text-primary">visitor@razaali.dev</span>
                    <span>:~$</span>{" "}
                    <span className="cursor-blink" aria-hidden />
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
                <span className="text-[10px] text-foreground-muted sm:text-[11px]">
                  # opens mailto → {EMAIL}
                </span>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn gap-2 text-sm disabled:pointer-events-none disabled:opacity-55"
                >
                  <Send className="size-3.5" aria-hidden />
                  $ send --message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
