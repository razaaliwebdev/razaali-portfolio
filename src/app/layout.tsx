import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { assets } from "@/Assets/assets";

// Load the Outfit font with CSS variable
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// export const metadata: Metadata = {
//   title: "Raza Ali Portfolio",
//   description: "Portfolio of Raza Ali – MERN Stack Developer",
// };

export const metadata: Metadata = {
  title: "Raza Ali | MERN Stack & Next.js Developer Portfolio",
  description:
    "Portfolio of Raza Ali – Full Stack Developer specializing in MERN Stack and Next.js, building scalable web apps with modern UI/UX design.",
  keywords: [
    "Raza Ali",
    "Raza",
    "Raza Ali Web Developer",
    "Raza Ali MERN Stack Developer",
    "Raza Ali Full Stack Developer",
    "Raza Web Developer",
    "Raza Ali Portfolio",
    "Web Developer Portfolio",
    "Full Stack Developer",
    "Razaaliwebdev",
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB Developer",
    "JavaScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack JavaScript Developer",
  ],
  authors: [
    { name: "Raza Ali", url: "https://razaali-portfolio.onrender.com" },
  ],
  creator: "Raza Ali",
  publisher: "Raza Ali",
  metadataBase: new URL("https://razaali-portfolio.onrender.com"),

  openGraph: {
    title: "Raza Ali | MERN Stack & Next.js Developer",
    description:
      "Explore the portfolio of Raza Ali – Full Stack Developer specializing in MERN Stack and Next.js, delivering modern and scalable web apps.",
    url: "https://razaali-portfolio.onrender.com",
    siteName: "Raza Ali Portfolio",
    images: [
      {
        url: `${assets.hero}`, // ✅ make sure this points to your preview image
        width: 1200,
        height: 630,
        alt: "Raza Ali | MERN Stack & Next.js Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Raza Ali | MERN Stack & Next.js Developer",
    description:
      "Portfolio of Raza Ali – Full Stack Developer skilled in React, Next.js, Node.js, and MongoDB.",
    images: [`${assets.hero}`],
    creator: "@razaaliwebdev", // ✅ your X (Twitter) handle
  },

  alternates: {
    canonical: "https://razaali-portfolio.onrender.com",
  },

  category: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Raza Ali",
              jobTitle: "Full Stack Developer",
              url: "https://razaali-portfolio.onrender.com",
              sameAs: [
                "https://github.com/razaaliwebdev",
                "https://linkedin.com/in/raza-webdev",
              ],
              knowsAbout: ["MERN Stack", "Next.js", "Web Development"],
            }),
          }}
        />
      </head>
      <body className={`${outfit.className} font-sans antialiased`}>
        <Navbar />
        <ScrollToTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}
