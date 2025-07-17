import { assets } from "@/Assets/assets";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <WhyWorkWithMe />
      <ProjectsSection />
    </div>
  );
}
