"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  upsertProject,
  deleteProject,
  deleteProjects,
  toggleProjectPublished,
  type ProjectFormState,
} from "@/lib/actions/projects";
import type { Project } from "@/db/schema";
import { Pagination } from "@/components/admin/Pagination";
import {
  adminFieldClass,
  adminLabelClass,
  TerminalPanel,
} from "@/components/admin/TerminalUi";

const PAGE_SIZE = 20;

export function ProjectEditor({
  initial,
  onDone,
}: {
  initial?: Project | null;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState<ProjectFormState, FormData>(
    upsertProject,
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
      title={initial ? `edit · ${initial.slug}` : "projects · new"}
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
        <label className={adminLabelClass}>
          <span>Cover image URL</span>
          <input
            name="coverImageUrl"
            defaultValue={initial?.coverImageUrl ?? ""}
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Tech stack</span>
          <input
            name="techStack"
            placeholder="Next.js, Neon, Drizzle"
            defaultValue={initial?.techStack ?? ""}
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Live URL</span>
          <input
            name="liveUrl"
            defaultValue={initial?.liveUrl ?? ""}
            className={adminFieldClass}
          />
        </label>
        <label className={adminLabelClass}>
          <span>Repo URL</span>
          <input
            name="repoUrl"
            defaultValue={initial?.repoUrl ?? ""}
            className={adminFieldClass}
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
        <label className="flex items-center gap-2 font-mono text-sm text-foreground-muted">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={initial?.isFeatured ?? false}
          />
          featured
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

export function ProjectsManager({ items }: { items: Project[] }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [projPage, setProjPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const projPageItems = items.slice(
    (projPage - 1) * PAGE_SIZE,
    projPage * PAGE_SIZE,
  );

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
          new project
        </button>
      </div>

      {creating ? (
        <ProjectEditor onDone={() => setCreating(false)} />
      ) : null}
      {editing ? (
        <ProjectEditor initial={editing} onDone={() => setEditing(null)} />
      ) : null}

      <TerminalPanel title="projects · ls" bodyClassName="overflow-x-auto">
        {selected.size > 0 && (
          <div className="flex items-center gap-3 border-b border-border px-3 py-2">
            <span className="font-mono text-xs text-danger">
              {selected.size} selected
            </span>
            <button
              type="button"
              className="font-mono text-xs text-danger underline"
              onClick={() => {
                if (
                  !window.confirm(
                    `Delete ${selected.size} selected project(s)?`,
                  )
                )
                  return;
                const ids = Array.from(selected);
                startTransition(async () => {
                  await deleteProjects(ids);
                  setSelected(new Set());
                  router.refresh();
                });
              }}
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
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-border font-mono text-[11px] text-foreground-muted">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={
                    projPageItems.length > 0 &&
                    projPageItems.every((i) => selected.has(i.id))
                  }
                  onChange={() => {
                    if (
                      projPageItems.length > 0 &&
                      projPageItems.every((i) => selected.has(i.id))
                    ) {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        for (const i of projPageItems) next.delete(i.id);
                        return next;
                      });
                    } else {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        for (const i of projPageItems) next.add(i.id);
                        return next;
                      });
                    }
                  }}
                  className="accent-primary"
                />
              </th>
              <th className="px-3 py-2 font-medium">title</th>
              <th className="px-3 py-2 font-medium">tech</th>
              <th className="px-3 py-2 font-medium">flags</th>
              <th className="px-3 py-2 font-medium">actions</th>
            </tr>
          </thead>
          <tbody>
            {projPageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 font-mono text-foreground-muted"
                >
                  // empty — create your first project
                </td>
              </tr>
            ) : (
              projPageItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-border/60 ${
                    selected.has(item.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(item.id)) next.delete(item.id);
                          else next.add(item.id);
                          return next;
                        });
                      }}
                      className="accent-primary"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-foreground">{item.title}</p>
                    <p className="font-mono text-[10px] text-tertiary">
                      {item.slug}
                    </p>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-foreground-muted">
                    {item.techStack || "—"}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">
                    <span className={item.isPublished ? "text-primary" : "text-foreground-muted"}>
                      {item.isPublished ? "published" : "draft"}
                    </span>
                    {item.isFeatured ? (
                      <span className="ml-2 text-secondary">featured</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/projects#${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-tertiary hover:text-primary"
                      >
                        view
                      </Link>
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
                            await toggleProjectPublished(
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
                          if (!window.confirm("Delete this project?")) return;
                          startTransition(async () => {
                            await deleteProject(item.id);
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
        <Pagination
          page={projPage}
          total={items.length}
          pageSize={PAGE_SIZE}
          onPageChange={setProjPage}
        />
      </TerminalPanel>
    </div>
  );
}
