import Expectation from "@/components/services/Expectation";
import ServicesSection from "@/components/services/ServicesSection";
import React from "react";

// app/services/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Raza Ali - Full Stack Web Development",
  description:
    "Explore the professional web development services offered by Raza Ali, specializing in MERN Stack, Next.js, and scalable web solutions.",
};

const Services = () => {
  return (
    <div>
      <ServicesSection />
      <Expectation />
    </div>
  );
};

export default Services;
