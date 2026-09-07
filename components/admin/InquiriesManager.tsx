"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteInquiries } from "@/lib/actions/inquiries";
import { formatInquirySource } from "@/lib/inquiry-source";
import { Pagination } from "@/components/admin/Pagination";
import {
  StatusBadge,
  TerminalPanel,
} from "@/components/admin/TerminalUi";
import type { Inquiry } from "@/db/schema";

const PAGE_SIZE = 20;

export function InquiriesManager({ items }: { items: Inquiry[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((i) => selected.has(i.id));

  function toggleAll() {
    if (allOnPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const i of pageItems) next.delete(i.id);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const i of pageItems) next.add(i.id);
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkDelete() {
    if (!window.confirm(`Delete ${selected.size} selected inquiry(ies)?`))
      return;
    const ids = Array.from(selected);
    startTransition(async () => {
      await deleteInquiries(ids);
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-md border border-danger/30 bg-danger/5 px-3 py-2">
          <span className="font-mono text-xs text-danger">
            {selected.size} selected
          </span>
          <button
            type="button"
            className="font-mono text-xs text-danger underline"
            onClick={bulkDelete}
          >
            delete selected
          </button>
          <button
            type="button"
            className="font-mono text-xs text-foreground-muted"
            onClick={() => setSelected(new Set())}
          >
            clear
          </button>
        </div>
      )}

      <TerminalPanel title="inbox" bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleAll}
                  className="accent-primary"
                />
              </th>
              <th className="px-3 py-2 font-medium">from</th>
              <th className="px-3 py-2 font-medium">subject</th>
              <th className="px-3 py-2 font-medium">source</th>
              <th className="px-3 py-2 font-medium">status</th>
              <th className="px-3 py-2 font-medium">when</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 font-mono text-foreground-muted"
                >
                  // inbox empty
                </td>
              </tr>
            ) : (
              pageItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-border/60 hover:bg-white/[0.02] ${
                    selected.has(item.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                      className="accent-primary"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/inquiries/${item.id}`}
                      className="block"
                    >
                      <p className="text-foreground">{item.name}</p>
                      <p className="font-mono text-[11px] text-foreground-muted">
                        {item.email}
                      </p>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/inquiries/${item.id}`}
                      className="text-foreground hover:text-primary"
                    >
                      {item.subject}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-tertiary">
                    {formatInquirySource(item.source, item.sourceRef)}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-3 font-mono text-[11px] text-foreground-muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          total={items.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </TerminalPanel>
    </div>
  );
}
