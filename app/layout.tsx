import type { Metadata } from "next";
import { JetBrains_Mono, Victor_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getSiteUrl,
  organizationJsonLd,
  SITE_NAME,
  SITE_OG_NAME,
  SITE_TAGLINE,
  TWITTER_HANDLE,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const site = getSiteUrl();
const defaultTitle = `${SITE_TAGLINE} | ${SITE_NAME}`;
const defaultDescription =
  "Hire Raza Ali for full stack web apps — React, Next.js, Node, MongoDB & PostgreSQL. Browse projects, services, and GitHub activity, then start a build.";

export const metadata: Metadata = {
  metadataBase: site,
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: SITE_OG_NAME,
  keywords: [
    "Raza Ali",
    "Full Stack Developer",
    "MERN Stack Developer",
    "PERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Raza Ali Software Engineer",
    "Software Engineer",
    "razaaliwebdev",
    "razaali.dev",
    "razaali",
    "Freelance Web Developer Lahore",
  ],
  authors: [{ name: SITE_NAME, url: site.origin }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: site.origin + "/",
    siteName: SITE_OG_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    creator: TWITTER_HANDLE,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: site.origin + "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0b0e14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${victorMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-mono text-foreground">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
