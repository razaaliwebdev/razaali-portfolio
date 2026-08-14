import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Web development services by Raza Ali";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "services.sh",
    title: "What I build",
    subtitle:
      "Full stack, frontend, backend, and deployment — ship production-ready products without the chaos.",
  });
}
