import type { Metadata } from "next";

export const SITE_NAME = "Raza Ali";
export const SITE_LEGAL_NAME = "Raza Ali";
export const SITE_TAGLINE = "Full Stack Developer (MERN & PERN)";
export const SITE_OG_NAME = "Raza Ali — Portfolio";
export const TWITTER_HANDLE = "@razaaliwebdev";

/** Canonical host without www */
export const CANONICAL_HOST = "razaali.dev";

export function getSiteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || `https://${CANONICAL_HOST}`;
  try {
    const url = new URL(raw);
    // Normalize: no trailing slash on origin path
    url.pathname = url.pathname.replace(/\/$/, "") || "/";
    if (url.pathname === "/") {
      return new URL(`${url.protocol}//${url.host}`);
    }
    return new URL(`${url.protocol}//${url.host}${url.pathname}`);
  } catch {
    return new URL(`https://${CANONICAL_HOST}`);
  }
}

/** Absolute URL for a path. Paths should be lowercase, no trailing slash (except `/`). */
export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base.origin + "/";
  const clean = path.startsWith("/") ? path : `/${path}`;
  const noTrail =
    clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  return `${base.origin}${noTrail}`;
}

/**
 * Indexing only on real production host.
 * Override with ALLOW_SEARCH_INDEXING=true|false.
 */
export function allowSearchIndexing(): boolean {
  if (process.env.ALLOW_SEARCH_INDEXING === "true") return true;
  if (process.env.ALLOW_SEARCH_INDEXING === "false") return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false;
  }
  try {
    const host = getSiteUrl().hostname.replace(/^www\./, "");
    return host === CANONICAL_HOST;
  } catch {
    return false;
  }
}

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  /** Use absolute title (skip template) */
  absoluteTitle?: boolean;
  ogType?: "website" | "profile" | "article";
  ogImagePath?: string;
  noIndex?: boolean;
  keywords?: string[];
};

/** Build consistent Metadata for a public page */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const title = input.absoluteTitle
    ? { absolute: input.title }
    : input.title;
  const ogTitle = input.absoluteTitle
    ? input.title
    : `${input.title} | ${SITE_NAME}`;
  const images = [
    {
      url: input.ogImagePath ?? absoluteUrl("/opengraph-image"),
      width: 1200,
      height: 630,
      alt: ogTitle,
    },
  ];

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: input.description,
      url,
      siteName: SITE_OG_NAME,
      locale: "en_US",
      type: input.ogType ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: images.map((i) => i.url),
      creator: TWITTER_HANDLE,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  const url = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: absoluteUrl("/favicon.ico"),
    sameAs: [
      "https://github.com/razaaliwebdev",
      "https://www.linkedin.com/in/razaaliwebdev",
      "https://x.com/razaaliwebdev",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional",
      email: "razaali.webdev@gmail.com",
      url: absoluteUrl("/contact"),
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_OG_NAME,
    url: absoluteUrl("/"),
    description:
      "Portfolio of Raza Ali — full stack developer specializing in MERN and PERN stacks.",
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    inLanguage: "en-US",
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    jobTitle: "Full Stack Developer",
    description:
      "Full stack developer specializing in MongoDB, Express, React, Node.js, PostgreSQL, and Next.js.",
    image: absoluteUrl("/images/raza.jpg"),
    email: "razaali.webdev@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    sameAs: [
      "https://github.com/razaaliwebdev",
      "https://www.linkedin.com/in/razaaliwebdev",
      "https://x.com/razaaliwebdev",
    ],
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "TypeScript",
    ],
  };
}
