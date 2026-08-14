import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

const PROFILE_SRC = "/images/raza.jpg";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

const STATS = [
  { key: "location", value: '"Lahore, PK"', tone: "string" as const },
  { key: "experience", value: "2+", tone: "number" as const },
  { key: "focus", value: '"Full Stack"', tone: "string" as const },
  { key: "available", value: "true", tone: "bool" as const },
];

function WindowChrome({
  title,
  icon,
}: {
  title: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-[#1a1f2a] px-3 py-2">
      <div className="flex shrink-0 gap-1">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: MAC_DOTS.close }}
          aria-hidden
        />
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: MAC_DOTS.minimize }}
          aria-hidden
        />
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: MAC_DOTS.maximize }}
          aria-hidden
        />
      </div>
      <span className="inline-flex min-w-0 items-center gap-1.5 truncate font-mono text-[11px] text-foreground-muted">
        {icon}
        {title}
      </span>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 border-t border-border/40 py-12 lg:py-16"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-25" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        <p className="mb-6 font-mono text-sm text-primary sm:mb-8">
          <span className="text-foreground-muted">{"//"}</span> 01. About Me
        </p>
        <h2 id="about-heading" className="sr-only">
          About Me
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-stretch lg:gap-4">
          {/* README */}
          <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-[#0f131a]">
            <WindowChrome
              title="README.md"
              icon={<FileText className="size-3.5 text-tertiary" aria-hidden />}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 font-mono text-[13px] leading-relaxed text-foreground sm:p-5 sm:text-sm">
              <p>
                Hello — I&apos;m{" "}
                <span className="text-primary">Raza Ali</span>, a full stack
                engineer focused on reliable MERN / PERN apps. My path started
                tinkering with systems and grew into shipping clean web products
                end to end.
              </p>

              <blockquote className="border-l-2 border-primary pl-3 text-foreground-muted">
                &ldquo;Simplicity is the ultimate sophistication.&rdquo;
              </blockquote>

              <ul className="space-y-1.5 text-primary">
                <li>
                  <span className="text-foreground-muted">›</span> Strong focus
                  on clean architecture.
                </li>
                <li>
                  <span className="text-foreground-muted">›</span> Bridging
                  backend logic with sharp UI.
                </li>
                <li>
                  <span className="text-foreground-muted">›</span> Continuous
                  learner in an evolving stack.
                </li>
              </ul>

              <div className="mt-auto space-y-2 border-t border-border/50 pt-4 text-[12px] text-foreground-muted sm:text-[13px]">
                <p>
                  <span className="text-tertiary">Core Focus:</span> Scalable APIs
                  &amp; React interfaces
                </p>
                <p>
                  <span className="text-tertiary">Current Obsession:</span>{" "}
                  PostgreSQL + Drizzle workflows
                </p>
                <p>
                  <span className="text-tertiary">Philosophy:</span>{" "}
                  <span className="text-foreground">
                    &ldquo;Code is read more often than it is written.&rdquo;
                  </span>
                </p>
                <p className="pt-1 text-primary">
                  <span className="cursor-blink" aria-hidden />
                  Constantly shipping — one commit at a time.
                </p>
              </div>
            </div>
          </article>

          {/* Pixelated profile — stretches to match README height */}
          <article className="mx-auto flex h-full w-full max-w-[20rem] flex-col overflow-hidden rounded-md border border-border bg-[#0f131a] lg:mx-0 lg:max-w-none">
            <WindowChrome title="profile.px" />
            <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
              <PixelatedCanvas
                src={PROFILE_SRC}
                width={320}
                height={400}
                cellSize={3}
                dotScale={0.9}
                shape="square"
                backgroundColor="#000000"
                dropoutStrength={0.35}
                interactive
                distortionStrength={3}
                distortionRadius={80}
                distortionMode="swirl"
                followSpeed={0.2}
                jitterStrength={4}
                jitterSpeed={4}
                sampleAverage
                objectFit="cover"
                tintColor="#3fb950"
                tintStrength={0.12}
                ariaLabel="Portrait of Raza Ali, full stack developer"
                className="block h-full max-h-full w-full max-w-full object-contain"
              />
            </div>
          </article>
        </div>

        {/* JSON-ish status cards */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-5 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="rounded-md border border-border bg-[#0f131a] px-3 py-3 font-mono text-[12px] sm:px-4 sm:text-[13px]"
            >
              <span className="text-foreground-muted">&quot;{stat.key}&quot;</span>
              <span className="text-foreground-muted">: </span>
              <span
                className={
                  stat.tone === "number"
                    ? "text-secondary"
                    : stat.tone === "bool"
                      ? "text-danger"
                      : "text-primary"
                }
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
