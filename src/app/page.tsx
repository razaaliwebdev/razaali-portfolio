import { assets } from "@/Assets/assets";
import HeroSection from "@/components/sections/HeroSection";
import MyProcess from "@/components/sections/MyProcess";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WhatIOffer from "@/components/sections/WhatIOffer";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <WhyWorkWithMe />
      <ProjectsSection />
      <MyProcess />
      <WhatIOffer />
    </div>
  );
}
