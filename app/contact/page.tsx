import type { Metadata } from "next";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact | Raza Ali",
  description:
    "Get in touch with Raza Ali — full stack engineer open to collaborations, freelance work, and product engineering conversations.",
};

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)]">
      <ContactView />
    </main>
  );
}
