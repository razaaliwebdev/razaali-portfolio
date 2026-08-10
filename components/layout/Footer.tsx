const YEAR = new Date().getFullYear();

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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    </svg>
  );
}

const SOCIAL = [
  {
    label: "github",
    href: "https://github.com/razaaliwebdev",
    icon: GitHubIcon,
  },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/razaaliwebdev/",
    icon: LinkedInIcon,
  },
  {
    label: "email",
    href: "mailto:razaali.webdev@gmail.com",
    icon: MailIcon,
  },
] as const;

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/50 bg-[#090c12]">
      {/* faint top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        aria-hidden
      />

      {/* status rail */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border/40 px-6 py-2 text-[10px] tracking-wide text-foreground-muted md:px-12 lg:px-24">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]" />
          <span className="text-primary">online</span>
        </span>
        <span className="hidden sm:inline">lahore · utc+5</span>
        <span className="hidden md:inline">pid:portfolio</span>
        <span className="ml-auto font-medium text-foreground/70">
          razaaliwebdev
        </span>
      </div>

      {/* main row */}
      <div className="flex flex-col gap-5 px-6 py-6 sm:py-7 md:flex-row md:items-center md:justify-between md:gap-8 md:px-12 lg:px-24">
        <div className="space-y-1">
          <p className="text-xs text-foreground-muted sm:text-[13px]">
            <span className="text-foreground/80">© {YEAR}</span>{" "}
            <span className="text-primary">razaali.dev</span>
            <span className="mx-2 text-border">—</span>
            <span>v2.0</span>
          </p>
          <p className="text-[11px] text-foreground-muted/80">
            Full Stack Engineer · MERN / PERN
          </p>
        </div>

        {/* live prompt — unique centerpiece */}
        <div
          className="order-first flex items-center gap-1.5 self-start rounded-sm border border-border/50 bg-[#0f131a] px-3 py-2 text-xs md:order-none md:self-auto sm:text-[13px]"
          aria-hidden
        >
          <span className="text-primary">visitor</span>
          <span className="text-foreground-muted">@</span>
          <span className="text-tertiary">razaali.dev</span>
          <span className="text-foreground-muted">:~$</span>
          <span className="text-foreground-muted">exit</span>
          <span className="text-primary"> 0</span>
          <span
            className="ml-0.5 inline-block h-3.5 w-2 translate-y-px bg-primary animate-[blink_1s_step-end_infinite]"
            aria-hidden
          />
        </div>

        <nav
          className="flex flex-wrap items-center gap-1 sm:gap-2"
          aria-label="Social"
        >
          {SOCIAL.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto:") ? undefined : "noopener noreferrer"
              }
              className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-foreground-muted transition-colors hover:text-primary sm:text-[13px]"
            >
              <Icon
                className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <span className="relative">
                {label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
              </span>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
