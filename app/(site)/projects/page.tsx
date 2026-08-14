import type { Metadata } from "next";
import ProjectsView from "@/components/projects/ProjectsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPublishedProjects } from "@/lib/actions/projects";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

const title = "Selected Full Stack Projects";
const description =
  "See shipped work by Raza Ali — Sello.pk marketplace, Amin Garage, and more MERN/PERN apps. Explore the stack, then discuss your next build.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/projects",
  ogImagePath: "/projects/opengraph-image",
});

export default async function ProjectsPage() {
  let projects: Array<{
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
  }> = [];

  try {
    const rows = await listPublishedProjects();
    projects = rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      coverImageUrl: p.coverImageUrl,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      techStack: p.techStack,
      isFeatured: p.isFeatured,
      sortOrder: p.sortOrder,
    }));
  } catch {
    projects = [];
  }

  const itemList =
    projects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Selected projects",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            description: p.summary,
            url: p.liveUrl || `${absoluteUrl("/projects")}#${p.slug}`,
          })),
        }
      : null;

  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          ...(itemList ? [itemList] : []),
        ]}
      />
      <ProjectsView projects={projects} />
    </main>
  );
}
