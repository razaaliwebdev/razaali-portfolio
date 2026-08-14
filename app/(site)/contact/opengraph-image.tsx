import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Contact Raza Ali — full stack developer";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return createOgImage({
    eyebrow: "contact.cmd",
    title: "Let's talk",
    subtitle:
      "Have a product idea or need a full stack engineer? Send a message and start the build.",
  });
}
