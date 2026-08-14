import type { Metadata } from "next";
import ServicesView from "@/components/services/ServicesView";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPublishedServices } from "@/lib/actions/services";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

const title = "Full Stack Web Development Services";
const description =
  "Need a full stack, frontend, backend, or deploy partner? Raza Ali ships production React/Next apps, APIs, and releases — start a project today.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/services",
  ogImagePath: "/services/opengraph-image",
});

export default async function ServicesPage() {
  let services: Array<{
    slug: string;
    title: string;
    summary: string;
    description: string;
    sortOrder: number;
  }> = [];

  try {
    const rows = await listPublishedServices();
    services = rows.map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      description: s.description,
      sortOrder: s.sortOrder,
    }));
  } catch {
    services = [];
  }

  const itemList =
    services.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Web development services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            description: s.summary,
            url: `${absoluteUrl("/services")}#${s.slug}`,
          })),
        }
      : null;

  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...(itemList ? [itemList] : []),
        ]}
      />
      <ServicesView services={services} />
    </main>
  );
}
