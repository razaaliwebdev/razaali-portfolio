import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Page Not Found",
    description:
      "That route does not exist on razaali.dev. Head home, browse services and projects, or contact Raza Ali.",
    path: "/404",
    noIndex: true,
  }),
};

export default function NotFound() {
  return <NotFoundView />;
}
