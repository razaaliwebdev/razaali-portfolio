"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  upsertService,
  deleteService,
  toggleServicePublished,
  type ServiceFormState,
} from "@/lib/actions/services";
import type { Service } from "@/db/schema";
import {
  adminFieldClass,
  adminLabelClass,
  TerminalPanel,
} from "@/components/admin/TerminalUi";

export function ServiceEditor({
  initial,
  onDone,
}: {
  initial?: Service | null;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState<ServiceFormState, FormData>(
    upsertService,
    {},
  );
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (state.ok && !done.current) {
      done.current = true;
      router.refresh();
      onDone?.();
    }
    if (!state.ok) done.current = false;
  }, [state, router, onDone]);

  return (
    <TerminalPanel
      title={initial ? `edit · ${initial.slug}` : "services · new"}
      bodyClassName="p-4"
    >
      <form action={action} className="grid gap-3 sm:grid-cols-2">
        {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
        <label className={`${adminLabelClass} sm:col-span-2`}>
          <span>Title</span>
          <input
            name="title"
            required
            defaultValue={initial?.title ?? ""}
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={initial?.slug ?? ""}
            placeholder="auto-from-title"
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={initial?.sortOrder ?? 0}
            className={adminFieldClass}
          />
        </label>
        <label className={`${adminLabelClass} sm:col-span-2`}>
          <span>Summary</span>
          <input
            name="summary"
            defaultValue={initial?.summary ?? ""}
            className={adminFieldClass}
          />
        </label>
        <label className={`${adminLabelClass} sm:col-span-2`}>
          <span>Description</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className={`${adminFieldClass} resize-y`}
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={initial?.isPublished ?? false}
          />
          published
        </label>
        <div className="flex items-center justify-end gap-2 sm:col-span-2">
          {state.error ? (
            <p className="mr-auto text-sm text-danger">{state.error}</p>
          ) : null}
          <button type="submit" disabled={pending} className="btn text-sm">
            {pending ? "Saving…" : initial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </TerminalPanel>
  );
}

export function ServicesManager({ items }: { items: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn text-sm"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
        >
          new service
        </button>
      </div>

      {creating ? (
        <ServiceEditor
          onDone={() => {
            setCreating(false);
          }}
        />
      ) : null}
      {editing ? (
        <ServiceEditor
          initial={editing}
          onDone={() => setEditing(null)}
        />
      ) : null}

      <TerminalPanel title="services · ls" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
            <tr>
              <th className="px-3 py-2 font-medium">title</th>
              <th className="px-3 py-2 font-medium">slug</th>
              <th className="px-3 py-2 font-medium">status</th>
              <th className="px-3 py-2 font-medium">actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 font-mono text-foreground-muted"
                >
                  // empty — create your first service
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="px-3 py-3 text-foreground">{item.title}</td>
                  <td className="px-3 py-3 font-mono text-xs text-tertiary">
                    {item.slug}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">
                    {item.isPublished ? (
                      <span className="text-primary">published</span>
                    ) : (
                      <span className="text-foreground-muted">draft</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="font-mono text-xs text-secondary hover:text-primary"
                        onClick={() => {
                          setEditing(item);
                          setCreating(false);
                        }}
                      >
                        edit
                      </button>
                      <button
                        type="button"
                        className="font-mono text-xs text-foreground-muted hover:text-tertiary"
                        onClick={() => {
                          startTransition(async () => {
                            await toggleServicePublished(
                              item.id,
                              !item.isPublished,
                            );
                            router.refresh();
                          });
                        }}
                      >
                        {item.isPublished ? "unpublish" : "publish"}
                      </button>
                      <button
                        type="button"
                        className="font-mono text-xs text-danger"
                        onClick={() => {
                          if (!window.confirm("Delete this service?")) return;
                          startTransition(async () => {
                            await deleteService(item.id);
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
    </div>
  );
}
