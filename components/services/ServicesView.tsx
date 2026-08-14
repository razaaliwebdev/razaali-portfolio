"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CloudUpload,
  Code2,
  Layers,
  Server,
  type LucideIcon,
} from "lucide-react";
import { contactHref } from "@/lib/inquiry-source";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

export type ServiceCardData = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  sortOrder: number;
};

const FALLBACK: ServiceCardData[] = [
  {
    slug: "full-stack",
    title: "Full Stack Development",
    summary: "End-to-end web apps from UI to database — shipped as one product.",
    description:
      "Product-ready applications with React/Next on the front, Node APIs in the middle, and Postgres or Mongo where data lives. Auth, dashboards, forms, and admin tooling included.",
    sortOrder: 0,
  },
  {
    slug: "frontend",
    title: "Frontend Engineering",
    summary: "Fast, accessible interfaces that feel intentional — not template-y.",
    description:
      "Pixel-tight UI with React, Next.js, TypeScript, and Tailwind. Motion where it helps, performance budgets, and layouts that hold up on mobile and desktop.",
    sortOrder: 1,
  },
  {
    slug: "backend",
    title: "Backend & APIs",
    summary: "Solid APIs, clean data models, and auth that doesn’t fall over.",
    description:
      "Express/Node services, REST endpoints, Drizzle/Mongoose schemas, validation, and integrations. Built to be readable, testable, and ready for real traffic.",
    sortOrder: 2,
  },
  {
    slug: "deployment",
    title: "Deployment & DevOps",
    summary: "Get it live — CI, containers, and hosting that stay maintainable.",
    description:
      "Docker, GitHub Actions, VPS/Cloud setups, env management, and zero-drama deploys so shipping doesn’t become a weekend project.",
    sortOrder: 3,
  },
];

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  "full-stack": Layers,
  frontend: Code2,
  backend: Server,
  deployment: CloudUpload,
  devops: CloudUpload,
};

const ACCENT_BY_INDEX = ["#3fb950", "#58a6ff", "#ffa657", "#3fb950"] as const;

function resolveIcon(slug: string): LucideIcon {
  const key = Object.keys(ICON_BY_SLUG).find((k) => slug.includes(k));
  return (key && ICON_BY_SLUG[key]) || Layers;
}

function WindowChrome({ title }: { title: string }) {
  return (
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
      <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-foreground-muted sm:text-xs">
        {title}
      </span>
    </div>
  );
}

export default function ServicesView({
  services,
}: {
  services: ServiceCardData[];
}) {
  const reduceMotion = useReducedMotion();
  const items = services.length > 0 ? services : FALLBACK;

  return (
    <section className="relative w-full pb-16 pt-10 lg:pb-20 lg:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(63,185,80,0.12),transparent_60%)]" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        {/* Intro — one composition */}
        <motion.div
          className="mb-10 max-w-3xl space-y-4 lg:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-sm text-primary">
            <span className="text-foreground-muted">{"//"}</span> services.sh
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What I build
            <span className="cursor-blink" aria-hidden />
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted sm:text-[15px]">
            From first pixel to production deploy — I help you ship full stack
            products, tighten frontends, harden backends, and get releases live
            without the chaos.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={contactHref({ source: "services" })}
              className="btn gap-2 text-sm"
            >
              Start a project
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link
              href="/#about"
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-primary hover:text-primary"
            >
              About me
            </Link>
          </div>
        </motion.div>

        {/* Service grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((service, i) => {
            const Icon = resolveIcon(service.slug);
            const accent = ACCENT_BY_INDEX[i % ACCENT_BY_INDEX.length];
            const cmd = `./${service.slug}.sh`;

            return (
              <motion.article
                key={service.slug}
                id={service.slug}
                className="group flex min-h-0 scroll-mt-24 flex-col overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-[border-color] duration-300 hover:border-primary/40"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <WindowChrome title={cmd} />
                <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex size-10 shrink-0 items-center justify-center border border-border bg-[#0b0e14]"
                      style={{ color: accent }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="font-mono text-[10px] text-foreground-muted">
                        <span style={{ color: accent }}>$</span> run{" "}
                        {service.slug}
                      </p>
                      <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {service.summary}
                  </p>
                  <p className="border-t border-border/60 pt-3 text-sm leading-relaxed text-foreground/85">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-1">
                    <Link
                      href={contactHref({
                        source: "services",
                        ref: service.slug,
                        topic: service.title,
                      })}
                      className="inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
                      style={{ color: accent }}
                    >
                      inquire --service={service.slug}
                      <ArrowRight className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Closing CTA */}
        <motion.div
          className="mt-8 overflow-hidden rounded-md border border-border bg-[#0f131a] lg:mt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <WindowChrome title="next-steps.md" />
          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="space-y-1">
              <p className="font-mono text-xs text-primary">
                // ready when you are
              </p>
              <p className="text-sm text-foreground-muted sm:text-[15px]">
                Tell me what you&apos;re building — I&apos;ll help map the stack
                and a clear path to ship.
              </p>
            </div>
            <Link
              href={contactHref({ source: "services" })}
              className="btn shrink-0 gap-2 text-sm"
            >
              Let&apos;s talk
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
