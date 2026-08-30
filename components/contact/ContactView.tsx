import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import ContactInquiryForm from "@/components/contact/ContactInquiryForm";

const EMAIL = "razaali.webdev@gmail.com";

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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.775-.963-1.394-1.803-1.79-.128 2.754-1.19 5.072-3.988 6.418-1.463.707-3.045.867-4.34.457-1.896-.597-3.257-2.206-3.506-4.235-.196-1.59.275-3.128 1.354-4.32 1.18-1.304 2.992-2.13 5.252-2.392.863-.101 1.747-.13 2.627-.085l.168 2.015c-1.66-.11-3.368-.01-4.97.566-1.258.455-2.067 1.214-2.353 2.202-.18.627-.18 1.294-.004 1.88.226.752.747 1.338 1.515 1.646.653.263 1.38.293 2.042.084.957-.3 1.67-.98 2.075-1.991l2.13.608c-.63 1.67-1.822 2.922-3.48 3.628-1.357.578-2.888.718-4.292.397zm5.747-8.383c-.136 0-.273.003-.41.01-1.782.093-3.253.66-4.22 1.725-.863.953-1.272 2.168-1.2 3.531.06 1.17.622 2.16 1.552 2.784.816.548 1.802.707 2.835.443 1.472-.376 2.56-1.53 3.075-3.343l.028-.1v-.108c-.002-.07-.003-.14-.006-.21-.14-.91-.628-1.647-1.45-2.178-.608-.39-1.33-.557-2.087-.557l-.107.003z" />
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
    href: "https://www.linkedin.com/in/razaali-dev/",
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/razaali.dev/",
    Icon: InstagramIcon,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/razaali.dev/",
    Icon: ThreadsIcon,
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

export default function ContactView({
  defaultSubject,
  source = "contact",
  sourceRef,
}: {
  defaultSubject?: string;
  source?: string;
  sourceRef?: string;
}) {
  return (
    <section className="relative w-full py-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(63,185,80,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10">
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

          <div className="min-w-0 overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
            <div className="relative flex items-center border-b border-border bg-[#1a1f2a] px-3 py-2.5">
              <div className="z-10 flex gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: "#FF5F57" }}
                  aria-hidden
                />
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: "#FEBC2E" }}
                  aria-hidden
                />
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: "#28C840" }}
                  aria-hidden
                />
              </div>
              <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] text-foreground-muted sm:text-xs">
                Send a message
              </span>
            </div>

            <ContactInquiryForm
              defaultSubject={defaultSubject}
              source={source}
              sourceRef={sourceRef}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
