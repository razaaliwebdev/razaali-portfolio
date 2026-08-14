"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  BriefcaseBusiness,
  ChevronsLeft,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareText,
  PanelLeft,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/lib/actions/auth";
import AdminNotifications from "@/components/admin/AdminNotifications";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: Activity,
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: MessageSquareText,
    badgeKey: "inquiries" as const,
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    icon: Mail,
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: BriefcaseBusiness,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
  },
] as const;

export default function AdminFrame({
  email,
  unreadInquiries = 0,
  children,
}: {
  email: string;
  unreadInquiries?: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [inquiryBadge, setInquiryBadge] = useState(unreadInquiries);

  useEffect(() => {
    setInquiryBadge(unreadInquiries);
  }, [unreadInquiries]);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "1") setCollapsed(true);
    setReady(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  const desktopWidth = collapsed ? "lg:w-[4.5rem]" : "lg:w-60";
  const desktopPad = collapsed ? "lg:pl-[4.5rem]" : "lg:pl-60";

  return (
    <div className="relative min-h-dvh bg-[#0b0e14]">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="hero-line-grid absolute inset-0 opacity-15" />
      </div>

      {/* Top bar — mobile + desktop */}
      <div
        className={`fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-border bg-[#0f131a]/90 px-3 backdrop-blur-md lg:h-14 lg:justify-end lg:px-6 ${desktopPad}`}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex size-9 items-center justify-center border border-border text-foreground-muted hover:border-primary hover:text-primary lg:hidden"
          aria-label="Open sidebar"
        >
          <PanelLeft className="size-4" />
        </button>
        <span className="text-sm font-medium text-foreground lg:hidden">
          Admin
        </span>
        <div className="flex items-center gap-3">
          <p className="hidden font-mono text-[11px] text-foreground-muted lg:block">
            <span className="text-primary">admin@razaali.dev</span>
            <span className="text-foreground-muted">:~$</span>
          </p>
          <AdminNotifications
            unreadHint={inquiryBadge}
            onCountChange={setInquiryBadge}
          />
        </div>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-[#0f131a] transition-[width,transform] duration-200 ease-out ${desktopWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${ready ? "" : "lg:w-60"}`}
      >
        <div
          className={`relative flex h-14 shrink-0 items-center border-b border-border px-3 ${
            collapsed ? "lg:justify-center lg:px-2" : "gap-3"
          }`}
        >
          <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
            <p className="truncate font-mono text-[10px] leading-none text-primary">
              <span className="text-foreground-muted">{"//"}</span> razaali.dev
            </p>
            <p className="mt-1 truncate text-sm font-semibold leading-none text-foreground">
              Admin
            </p>
          </div>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden size-8 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-white/5 hover:text-primary lg:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <span className="font-mono text-xs font-semibold text-primary">
                ra
              </span>
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex size-8 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-white/5 hover:text-primary lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Admin">
          {NAV.map((item) => {
            const exact = "exact" in item && item.exact;
            const active = exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            const showBadge =
              "badgeKey" in item &&
              item.badgeKey === "inquiries" &&
              inquiryBadge > 0;
            const rowClass = `relative flex items-center gap-3 px-3 py-2.5 text-sm ${
              collapsed ? "lg:justify-center lg:px-2" : ""
            }`;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`${rowClass} transition-colors ${
                  active
                    ? "border border-primary/40 bg-primary/10 text-primary"
                    : "border border-transparent text-foreground-muted hover:border-border hover:text-foreground"
                }`}
              >
                <span className="relative shrink-0">
                  <Icon className="size-4" />
                  {showBadge && collapsed ? (
                    <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary lg:block" />
                  ) : null}
                </span>
                <span
                  className={`flex min-w-0 flex-1 items-center justify-between gap-2 ${
                    collapsed ? "lg:hidden" : ""
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {showBadge ? (
                    <span className="shrink-0 bg-primary px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0b0e14]">
                      {inquiryBadge > 99 ? "99+" : inquiryBadge}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-2">
          <p
            className={`truncate px-2 text-[11px] text-foreground-muted ${
              collapsed ? "lg:hidden" : ""
            }`}
            title={email}
          >
            {email}
          </p>

          <Link
            href="/"
            title="View site"
            className={`flex items-center gap-3 border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary hover:text-primary ${
              collapsed ? "lg:justify-center lg:px-2" : ""
            }`}
          >
            <ExternalLink className="size-4 shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>View site</span>
          </Link>

          <form action={signOutAdmin}>
            <button
              type="submit"
              title="Sign out"
              className={`flex w-full items-center gap-3 border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-danger hover:text-danger ${
                collapsed ? "lg:justify-center lg:px-2" : ""
              }`}
            >
              <LogOut className="size-4 shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      <div
        className={`min-h-dvh pt-12 transition-[padding] duration-200 lg:pt-14 ${desktopPad}`}
      >
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
