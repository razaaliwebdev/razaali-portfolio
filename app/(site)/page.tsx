import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Skills from "@/components/home/Skills";
import Contributions from "@/components/home/Contributions";
import Newsletter from "@/components/home/Newsletter";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata, personJsonLd, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

const title = `${SITE_TAGLINE} | ${SITE_NAME}`;
const description =
  "Hire Raza Ali for full stack web apps — React, Next.js, Node, MongoDB & PostgreSQL. Browse projects, services, and GitHub activity, then start a build.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/",
  absoluteTitle: true,
  ogType: "profile",
  ogImagePath: "/opengraph-image",
  keywords: [
    "Raza Ali",
    "Full Stack Developer",
    "MERN",
    "PERN",
    "Next.js portfolio",
  ],
});

export default function Home() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <JsonLd data={personJsonLd()} />
      <Hero />
      <About />
      <Skills />
      <Newsletter />
      <Contributions />
    </main>
  );
}
