import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Raza Ali — Full Stack Developer portfolio";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "dev_portfolio_v2.0",
    title: "Raza Ali",
    subtitle:
      "Full stack developer building production web apps with React, Next.js, Node, and Postgres.",
  });
}
