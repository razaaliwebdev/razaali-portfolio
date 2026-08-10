"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, SquareTerminal, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV_LINKS } from "@/constants";

function TypedText({
  title,
  delay,
  reduceMotion,
}: {
  title: string;
  delay: number;
  reduceMotion: boolean;
}) {
  const [shown, setShown] = useState(reduceMotion ? title : "");

  useEffect(() => {
    if (reduceMotion) return;

    let i = 0;
    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1;
        setShown(title.slice(0, i));
        if (i >= title.length) window.clearInterval(intervalId);
      }, 26);
    }, delay);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [delay, reduceMotion, title]);

  const done = shown.length >= title.length;

  return (
    <>
      <span className="text-foreground">{shown}</span>
      {!done && <span className="cursor-blink" aria-hidden />}
    </>
  );
}

function TypedLink({
  href,
  title,
  active,
  delay,
  onNavigate,
}: {
  href: string;
  title: string;
  active: boolean;
  delay: number;
  onNavigate: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-baseline gap-2 py-2 text-lg text-foreground-muted transition-colors duration-300 hover:text-primary"
    >
      <span className="text-primary">$</span>
      {active ? (
        <TypedText
          title={title}
          delay={delay}
          reduceMotion={reduceMotion === true}
        />
      ) : (
        <span className="text-foreground" aria-hidden />
      )}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 8,
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky bg-background/30 top-0 z-40 border-b transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled
          ? "border-border-hover bg-background/60 shadow-lg shadow-black/30 backdrop-blur-xl"
          : "border-border bg-background/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3 md:px-12 lg:px-24">
        <Link
          href="/"
          className="text-lg font-medium text-primary transition-colors duration-300 hover:text-foreground"
        >
          ~/dev_portfolio_v2.0
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-sm text-foreground-muted transition-colors duration-300 hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="text-foreground-muted transition-colors hover:text-primary"
            aria-label="Open terminal"
          >
            <SquareTerminal className="size-5" />
          </button>
          <a
            href="/file/Raza_Ali_resume.pdf"
            download="Raza_Ali_Resume.pdf"
            className="btn"
          >
            $Download CV
          </a>
        </div>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          type="button"
          className="relative z-50 flex size-10 items-center justify-center text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={reduceMotion ? false : { opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="size-6" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={reduceMotion ? false : { opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="size-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile terminal menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-background/85 backdrop-blur-sm"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
            />

            <motion.nav
              className="absolute inset-x-4 top-17 overflow-hidden rounded-lg border border-border bg-background-panel font-mono shadow-lg"
              initial={
                reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Mobile"
            >
              <div className="relative flex items-center border-b border-border px-3 py-2">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-danger" />
                  <span className="size-2.5 rounded-full bg-secondary" />
                  <span className="size-2.5 rounded-full bg-primary" />
                </div>
                <span className="absolute inset-x-0 text-center text-xs text-foreground-muted">
                  nav.sh
                </span>
              </div>

              <div className="space-y-1 px-5 py-5">
                <p className="mb-3 text-xs text-foreground-muted">
                  <span className="text-primary">$</span> ls ./routes
                </p>

                {NAV_LINKS.map((link, i) => (
                  <TypedLink
                    key={link.id}
                    href={link.href}
                    title={link.title}
                    active={open}
                    delay={120 + i * 220}
                    onNavigate={() => setOpen(false)}
                  />
                ))}

                <div className="mt-6 border-t border-border pt-4">
                  <a
                    href="/file/Raza_Ali_resume.pdf"
                    download="Raza_Ali_Resume.pdf"
                    className="btn"
                    onClick={() => setOpen(false)}
                  >
                    $Download CV
                  </a>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
