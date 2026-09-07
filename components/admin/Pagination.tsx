"use client";

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
      <p className="font-mono text-[11px] text-foreground-muted">
        {total} total · page {page}/{totalPages}
      </p>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={page <= 1}
          className="px-2 py-1 font-mono text-xs text-foreground-muted hover:text-foreground disabled:opacity-30"
          onClick={() => onPageChange(page - 1)}
        >
          prev
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-1 py-1 font-mono text-xs text-foreground-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`px-2 py-1 font-mono text-xs ${
                p === page
                  ? "text-primary"
                  : "text-foreground-muted hover:text-foreground"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          className="px-2 py-1 font-mono text-xs text-foreground-muted hover:text-foreground disabled:opacity-30"
          onClick={() => onPageChange(page + 1)}
        >
          next
        </button>
      </div>
    </div>
  );
}
