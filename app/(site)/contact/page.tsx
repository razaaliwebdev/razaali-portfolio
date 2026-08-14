import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";
import { JsonLd } from "@/components/seo/JsonLd";
import { normalizeInquirySource } from "@/lib/inquiry-source";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

const title = "Contact a Full Stack Developer";
const description =
  "Ready to ship? Message Raza Ali about your product, stack, or freelance full stack work. Valid emails get a confirmation — usually a quick reply.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/contact",
  ogImagePath: "/contact/opengraph-image",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; source?: string; ref?: string }>;
}) {
  const { topic, source, ref } = await searchParams;

  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactView
        defaultSubject={topic?.trim() || undefined}
        source={normalizeInquirySource(source)}
        sourceRef={ref?.trim().slice(0, 120) || undefined}
      />
    </main>
  );
}
