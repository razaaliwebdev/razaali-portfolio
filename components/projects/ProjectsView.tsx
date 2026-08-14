"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ExternalLink, FolderGit2 } from "lucide-react";
import { contactHref } from "@/lib/inquiry-source";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImageUrl: string;
  liveUrl: string;
  repoUrl: string;
  techStack: string;
  isFeatured: boolean;
  sortOrder: number;
};

const FALLBACK: ProjectCardData[] = [
  {
    slug: "sello-pk",
    title: "Sello.pk",
    summary:
      "Pakistan’s car marketplace — listings, auctions, and AI price estimates.",
    description:
      "A full MERN platform for buying and selling cars across Pakistan: verified listings, live auctions, seller dashboards, and an AI car estimator tuned for the local market.",
    coverImageUrl: "",
    liveUrl: "https://sello.pk",
    repoUrl: "",
    techStack: "MongoDB, Express, React, Node.js",
    isFeatured: true,
    sortOrder: 0,
  },
  {
    slug: "amin-garage",
    title: "Amin Garage",
    summary:
      "Amin Auto Care — React marketing site for a full-service auto garage.",
    description:
      "A React.js website for Amin Garage (Faqir Wali): service catalog, quotes, gallery, reviews, and location — built to convert walk-in and local search traffic.",
    coverImageUrl: "",
    liveUrl: "https://amingarage.com",
    repoUrl: "",
    techStack: "React.js",
    isFeatured: false,
    sortOrder: 1,
  },
];

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

function techParts(stack: string) {
  return stack
    .split(/[,|/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function ProjectCard({
  project,
  index,
  reduceMotion,
}: {
  project: ProjectCardData;
  index: number;
  reduceMotion: boolean | null;
}) {
  const techs = techParts(project.techStack);
  const host = project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <motion.article
      id={project.slug}
      className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-md border border-border bg-[#0f131a] shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-[border-color] duration-300 hover:border-primary/40"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <WindowChrome title={`./${project.slug}.proj`} />

      <div className="grid min-h-[17.5rem] flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="flex flex-col gap-3 p-4 sm:gap-3.5 sm:p-5">
          <div className="flex min-h-[1.25rem] flex-wrap items-center gap-2">
            {project.isFeatured ? (
              <span className="border border-secondary/40 bg-secondary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-secondary">
                featured
              </span>
            ) : (
              <span className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-foreground-muted">
                project
              </span>
            )}
            <span className="font-mono text-[10px] text-foreground-muted">
              $ cat README.md
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {project.title}
            </h2>
            <p className="line-clamp-2 text-sm text-foreground-muted">
              {project.summary}
            </p>
          </div>

          <p className="line-clamp-3 border-t border-border/60 pt-3 text-sm leading-relaxed text-foreground/85">
            {project.description}
          </p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {techs.map((tech) => (
              <li
                key={tech}
                className="border border-border bg-[#0b0e14] px-2 py-0.5 font-mono text-[10px] text-tertiary"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn gap-2 text-sm"
              >
                Live site
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary hover:text-primary"
              >
                <FolderGit2 className="size-3.5" aria-hidden />
                Source
              </a>
            ) : null}
            <Link
              href={contactHref({
                source: "projects",
                ref: project.slug,
                topic: project.title,
              })}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-tertiary transition-colors hover:text-primary"
            >
              discuss a build
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[11rem] border-t border-border bg-[#0b0e14] md:min-h-0 md:border-l md:border-t-0">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={`${project.title} project preview`}
              fill
              unoptimized
              className="object-cover opacity-90"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="relative flex h-full min-h-[11rem] flex-col justify-between gap-4 p-4 font-mono text-xs md:min-h-0">
              <div className="space-y-1.5">
                <p className="text-primary">// meta</p>
                <p className="text-foreground-muted">
                  stack ·{" "}
                  <span className="text-foreground">{techs.length}</span>
                </p>
                <p className="text-foreground-muted">
                  type ·{" "}
                  <span className="text-foreground">
                    {project.isFeatured ? "featured" : "shipped"}
                  </span>
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-foreground-muted">status</p>
                <p className="text-primary">production · live</p>
                {host ? (
                  <p className="truncate text-tertiary" title={host}>
                    {host}
                  </p>
                ) : null}
              </div>
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 70% 30%, rgba(63,185,80,0.2), transparent 55%), radial-gradient(circle at 20% 80%, rgba(88,166,255,0.15), transparent 50%)",
                }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsView({
  projects,
}: {
  projects: ProjectCardData[];
}) {
  const reduceMotion = useReducedMotion();
  const items = (projects.length > 0 ? projects : FALLBACK)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || Number(b.isFeatured) - Number(a.isFeatured));

  return (
    <section className="relative w-full pb-16 pt-10 lg:pb-20 lg:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(88,166,255,0.12),transparent_60%)]" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        <motion.div
          className="mb-10 max-w-3xl space-y-4 lg:mb-12"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-sm text-primary">
            <span className="text-foreground-muted">{"//"}</span> project.lib
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Selected work
            <span className="cursor-blink" aria-hidden />
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted sm:text-[15px]">
            Real products shipped with modern stacks — marketplaces, dashboards,
            and full stack web apps built for production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {items.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <motion.div
          className="mt-8 overflow-hidden rounded-md border border-border bg-[#0f131a] lg:mt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <WindowChrome title="collaborate.sh" />
          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="space-y-1">
              <p className="font-mono text-xs text-primary">// next build</p>
              <p className="text-sm text-foreground-muted sm:text-[15px]">
                Have a product idea? Let&apos;s map the stack and ship it.
              </p>
            </div>
            <Link
              href={contactHref({ source: "projects" })}
              className="btn shrink-0 gap-2 text-sm"
            >
              Start a project
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
