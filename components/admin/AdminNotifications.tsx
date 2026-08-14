"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  getAdminNotifications,
  type AdminNotificationsPayload,
} from "@/lib/actions/notifications";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminNotifications({
  unreadHint = 0,
  onCountChange,
}: {
  unreadHint?: number;
  onCountChange?: (count: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AdminNotificationsPayload>({
    unreadCount: unreadHint,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const onCountChangeRef = useRef(onCountChange);
  onCountChangeRef.current = onCountChange;

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const next = await getAdminNotifications();
      setData(next);
      onCountChangeRef.current?.(next.unreadCount);
    } catch {
      // keep last known
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), 45_000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    void refresh();
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, refresh]);

  const count = data.unreadCount;
  const badge = count > 99 ? "99+" : count > 0 ? String(count) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex size-9 items-center justify-center border border-border text-foreground-muted transition-colors hover:border-primary hover:text-primary"
        aria-label={
          count > 0 ? `Notifications, ${count} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="size-4" />
        {badge ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center bg-primary px-1 font-mono text-[10px] font-bold leading-none text-[#0b0e14] shadow-[0_0_10px_rgba(63,185,80,0.55)]">
            {badge}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden border border-border bg-[#0f131a] shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between border-b border-border bg-[#1a1f2a] px-3 py-2.5">
            <p className="font-mono text-[11px] text-foreground-muted">
              <span className="text-primary">$</span> notifications
              {loading ? (
                <span className="ml-2 text-secondary">…</span>
              ) : null}
            </p>
            {count > 0 ? (
              <span className="bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                {count} new
              </span>
            ) : (
              <span className="font-mono text-[10px] text-foreground-muted">
                clear
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {data.items.length === 0 ? (
              <p className="px-4 py-8 text-center font-mono text-xs text-foreground-muted">
                // inbox quiet — no new inquiries
              </p>
            ) : (
              <ul>
                {data.items.map((item) => (
                  <li key={item.id} className="border-b border-border/60">
                    <Link
                      href={`/admin/inquiries/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-3 transition-colors hover:bg-primary/5"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(63,185,80,0.7)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-foreground">
                            {item.name}
                            <span className="text-foreground-muted">
                              {" "}
                              · {item.subject}
                            </span>
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-foreground-muted">
                            {item.email}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-tertiary">
                            {timeAgo(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border bg-[#0b0e14] px-3 py-2">
            <Link
              href="/admin/inquiries"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-primary hover:text-primary-bright"
            >
              view all inquiries →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
