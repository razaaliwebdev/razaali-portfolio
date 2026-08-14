"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteSubscriber,
  sendNewsletterBroadcast,
  setSubscriberStatus,
  type BroadcastState,
} from "@/lib/actions/newsletter";
import type {
  NewsletterCampaign,
  NewsletterSubscriber,
} from "@/db/schema";
import {
  adminFieldClass,
  adminLabelClass,
  TerminalPanel,
} from "@/components/admin/TerminalUi";

export function NewsletterManager({
  subscribers,
  campaigns,
  stats,
}: {
  subscribers: NewsletterSubscriber[];
  campaigns: NewsletterCampaign[];
  stats: { total: number; active: number; campaigns: number };
}) {
  const [state, action, pending] = useActionState<BroadcastState, FormData>(
    sendNewsletterBroadcast,
    {},
  );
  const router = useRouter();
  const [, startTransition] = useTransition();
  const done = useRef(false);

  useEffect(() => {
    if (state.ok && !done.current) {
      done.current = true;
      router.refresh();
    }
    if (!state.ok) done.current = false;
  }, [state, router]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TerminalPanel title="subscribers" bodyClassName="p-4">
          <p className="font-mono text-xs text-foreground-muted">active</p>
          <p className="mt-1 text-3xl font-semibold text-primary">
            {stats.active}
          </p>
          <p className="mt-2 font-mono text-[11px] text-foreground-muted">
            total {stats.total}
          </p>
        </TerminalPanel>
        <TerminalPanel title="list health" bodyClassName="p-4">
          <p className="font-mono text-xs text-foreground-muted">unsubscribed</p>
          <p className="mt-1 text-3xl font-semibold text-secondary">
            {Math.max(stats.total - stats.active, 0)}
          </p>
        </TerminalPanel>
        <TerminalPanel title="campaigns" bodyClassName="p-4">
          <p className="font-mono text-xs text-foreground-muted">sent</p>
          <p className="mt-1 text-3xl font-semibold text-tertiary">
            {stats.campaigns}
          </p>
        </TerminalPanel>
      </div>

      <TerminalPanel title="broadcast · compose" bodyClassName="p-4">
        <form action={action} className="space-y-4">
          <p className="font-mono text-xs text-foreground-muted">
            // sends to all <span className="text-primary">active</span>{" "}
            subscribers · includes unsubscribe link · paced for SMTP limits
          </p>
          <label className={adminLabelClass}>
            <span>Subject</span>
            <input
              name="subject"
              required
              placeholder="Shipping note · new project"
              className={adminFieldClass}
            />
          </label>
          <label className={adminLabelClass}>
            <span>Body</span>
            <textarea
              name="body"
              required
              rows={8}
              placeholder={"Hey,\n\nQuick update from razaali.dev…\n"}
              className={`${adminFieldClass} min-h-[10rem] resize-y`}
            />
          </label>
          {state.error ? (
            <p className="text-sm text-danger">{state.error}</p>
          ) : null}
          {state.ok ? (
            <p className="font-mono text-sm text-primary">
              ✓ sent {state.sentCount}
              {state.failedCount
                ? ` · failed ${state.failedCount}`
                : ""}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending || stats.active === 0}
            className="btn text-sm disabled:pointer-events-none disabled:opacity-55"
            onClick={(e) => {
              if (
                !window.confirm(
                  `Send this email to ${stats.active} active subscriber(s)?`,
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            {pending
              ? `Sending to ${stats.active}…`
              : `Send to ${stats.active} active`}
          </button>
        </form>
      </TerminalPanel>

      <TerminalPanel title="subscribers · ls" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
            <tr>
              <th className="px-3 py-2 font-medium">email</th>
              <th className="px-3 py-2 font-medium">status</th>
              <th className="px-3 py-2 font-medium">joined</th>
              <th className="px-3 py-2 font-medium">actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-8 font-mono text-foreground-muted"
                >
                  // no subscribers yet
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border/60">
                  <td className="px-3 py-3 font-mono text-xs text-foreground">
                    {sub.email}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">
                    {sub.status === "active" ? (
                      <span className="text-primary">active</span>
                    ) : (
                      <span className="text-foreground-muted">unsubscribed</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-foreground-muted">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {sub.status === "active" ? (
                        <button
                          type="button"
                          className="font-mono text-xs text-secondary hover:text-primary"
                          onClick={() => {
                            startTransition(async () => {
                              await setSubscriberStatus(sub.id, "unsubscribed");
                              router.refresh();
                            });
                          }}
                        >
                          unsubscribe
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="font-mono text-xs text-tertiary hover:text-primary"
                          onClick={() => {
                            startTransition(async () => {
                              await setSubscriberStatus(sub.id, "active");
                              router.refresh();
                            });
                          }}
                        >
                          reactivate
                        </button>
                      )}
                      <button
                        type="button"
                        className="font-mono text-xs text-danger"
                        onClick={() => {
                          if (!window.confirm("Delete this subscriber?")) return;
                          startTransition(async () => {
                            await deleteSubscriber(sub.id);
                            router.refresh();
                          });
                        }}
                      >
                        rm
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TerminalPanel>

      <TerminalPanel title="campaigns · history" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
            <tr>
              <th className="px-3 py-2 font-medium">subject</th>
              <th className="px-3 py-2 font-medium">sent</th>
              <th className="px-3 py-2 font-medium">failed</th>
              <th className="px-3 py-2 font-medium">when</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 font-mono text-foreground-muted"
                >
                  // no campaigns yet
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/60">
                  <td className="px-3 py-3 text-foreground">{c.subject}</td>
                  <td className="px-3 py-3 font-mono text-xs text-primary">
                    {c.sentCount}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-danger">
                    {c.failedCount}
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-foreground-muted">
                    {c.sentAt
                      ? new Date(c.sentAt).toLocaleString()
                      : new Date(c.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TerminalPanel>
    </div>
  );
}
