import AboutHeroSection from "@/components/about/AboutHeroSection";
import React from "react";
import Experience from "../../components/about/Experience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Raza Ali - MERN Stack & Next.js Developer",
  description:
    "Learn more about Raza Ali, a passionate MERN Stack and Next.js Developer with experience in building scalable and user-friendly web applications.",
};

const About = () => {
  return (
    <div className="">
      <AboutHeroSection />
      <Experience />
    </div>
  );
};

export default About;
