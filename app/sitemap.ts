import type { MetadataRoute } from "next";
import { listPublishedProjects } from "@/lib/actions/projects";
import { listPublishedServices } from "@/lib/actions/services";
import { absoluteUrl, allowSearchIndexing } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!allowSearchIndexing()) {
    return [];
  }

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  // Fragment URLs are not separate indexable documents; list pages cover them.
  // When project/service detail routes exist, append them from DB below.

  try {
    const [projects, services] = await Promise.all([
      listPublishedProjects(),
      listPublishedServices(),
    ]);

    // Keep sitemap accurate: only real routes today are list pages.
    // Use DB timestamps to freshen lastModified on list URLs when content changes.
    const projectUpdated = projects.reduce<Date | null>((latest, p) => {
      const d = p.updatedAt ? new Date(p.updatedAt) : null;
      if (!d) return latest;
      return !latest || d > latest ? d : latest;
    }, null);
    const serviceUpdated = services.reduce<Date | null>((latest, s) => {
      const d = s.updatedAt ? new Date(s.updatedAt) : null;
      if (!d) return latest;
      return !latest || d > latest ? d : latest;
    }, null);

    return staticEntries.map((entry) => {
      if (entry.url === absoluteUrl("/projects") && projectUpdated) {
        return { ...entry, lastModified: projectUpdated };
      }
      if (entry.url === absoluteUrl("/services") && serviceUpdated) {
        return { ...entry, lastModified: serviceUpdated };
      }
      return entry;
    });
  } catch {
    return staticEntries;
  }
}
