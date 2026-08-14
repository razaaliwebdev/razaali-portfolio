import {
  absoluteUrl,
  allowSearchIndexing,
  getSiteUrl,
} from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().origin;

  if (!allowSearchIndexing()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      host: base,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/newsletter/unsubscribe",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: base,
  };
}
