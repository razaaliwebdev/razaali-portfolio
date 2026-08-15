"use client";

import dynamic from "next/dynamic";

const Contributions = dynamic(
  () => import("@/components/home/Contributions"),
  {
    ssr: false,
    loading: () => (
      <section
        className="relative w-full border-t border-border/40 py-10 lg:py-12"
        aria-hidden
      >
        <div className="w-full px-4 md:px-12 lg:px-24">
          <div className="min-h-[22rem] animate-pulse rounded-lg border border-border bg-[#0f131a]" />
        </div>
      </section>
    ),
  },
);

export default function ContributionsLazy() {
  return <Contributions />;
}
