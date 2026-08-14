import type { Metadata } from "next";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In | Raza Ali",
  robots: { index: false, follow: false },
};

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
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
            admin · sign in
          </span>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">
              Admin access
            </h1>
            <p className="text-sm text-foreground-muted">
              Sign in to manage portfolio content and inquiries.
            </p>
          </div>

          <AdminLoginForm />

          <p className="text-center text-xs text-foreground-muted">
            <Link href="/" className="text-tertiary hover:text-primary">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
