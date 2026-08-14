import type { Metadata } from "next";
import Link from "next/link";
import { unsubscribeByToken } from "@/lib/actions/newsletter";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Newsletter Unsubscribe",
    description:
      "Confirm removal from the Raza Ali portfolio newsletter list. This page is private and not indexed.",
    path: "/newsletter/unsubscribe",
    noIndex: true,
  }),
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token
    ? await unsubscribeByToken(token)
    : { ok: false as const, error: "Missing unsubscribe token." };

  return (
    <main className="relative flex min-h-[calc(100dvh-3.75rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-md border border-border bg-[#0f131a]">
        <div className="border-b border-border bg-[#1a1f2a] px-4 py-2.5 font-mono text-[11px] text-foreground-muted">
          newsletter · unsubscribe
        </div>
        <div className="space-y-4 px-5 py-6">
          {result.ok ? (
            <>
              <h1 className="text-xl font-semibold text-foreground">
                Unsubscribed
              </h1>
              <p className="text-sm text-foreground-muted">
                {result.email} has been removed from the newsletter list.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground">
                Couldn&apos;t unsubscribe
              </h1>
              <p className="text-sm text-danger">
                {"error" in result ? result.error : "Something went wrong."}
              </p>
            </>
          )}
          <Link
            href="/"
            className="inline-block text-sm text-tertiary hover:text-primary"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
