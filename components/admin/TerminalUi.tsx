import type { ReactNode } from "react";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

export function TerminalPanel({
  title,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-border bg-[#0f131a] ${className}`}
    >
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
          {title}
        </span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

export function CmdHeading({
  path,
  command,
  hint,
}: {
  path: string;
  command: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-sm text-foreground">
        <span className="text-primary">admin@razaali.dev</span>
        <span className="text-foreground-muted">:</span>
        <span className="text-tertiary">~/{path}</span>
        <span className="text-foreground-muted">$ </span>
        <span>{command}</span>
        <span className="cursor-blink" aria-hidden />
      </p>
      {hint ? (
        <p className="text-sm text-foreground-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "new"
      ? "border-primary/40 bg-primary/10 text-primary"
      : status === "replied"
        ? "border-tertiary/40 bg-tertiary/10 text-tertiary"
        : status === "archived"
          ? "border-border text-foreground-muted"
          : "border-secondary/40 bg-secondary/10 text-secondary";

  return (
    <span
      className={`inline-flex border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${tone}`}
    >
      {status}
    </span>
  );
}

export const adminFieldClass =
  "w-full border border-border bg-[#0b0e14] px-3 py-2 font-mono text-sm text-foreground outline-none placeholder:text-foreground-muted/45 focus:border-primary";

export const adminLabelClass = "block space-y-1.5 text-sm text-foreground-muted";
