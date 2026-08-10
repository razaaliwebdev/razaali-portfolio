import type { Metadata } from "next";
import { JetBrains_Mono, Victor_Mono } from "next/font/google";
import { BootSplash } from "@/components/TerminalLoader";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Raza Ali | Full Stack Developer (MERN / PERN)",
  description:
    "Portfolio of Raza Ali, a Full Stack Developer specializing in MongoDB, Express, React, Node.js, PostgreSQL & Prisma. Explore projects, tech stack, and GitHub activity.",
  keywords: [
    "Raza Ali",
    "Raza Ali Portfolio",
    "Full Stack Developer",
    "MERN Stack Developer",
    "PERN Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer Portfolio",
    "Portfolio",
  ],
  authors: [{ name: "Raza Ali" }],
  creator: "Raza Ali",
  metadataBase: new URL("https://razaali.dev"),
  openGraph: {
    title: "Raza Ali | Full Stack Developer (MERN / PERN)",
    description:
      "Building Software That Solves Real Problems. Explore my projects, tech stack, and GitHub activity.",
    url: "https://razaali.dev",
    siteName: "Raza Ali — Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Raza Ali | Full Stack Developer (MERN / PERN)",
    description: "Building Software That Solves Real Problems.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#0b0e14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${victorMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-mono">
        <BootSplash />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
