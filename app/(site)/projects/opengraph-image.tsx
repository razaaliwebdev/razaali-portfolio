import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Selected projects by Raza Ali";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "project.lib",
    title: "Selected work",
    subtitle:
      "Production marketplaces and full stack apps — including Sello.pk and Amin Garage.",
  });
}
