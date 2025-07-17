import AboutSection from "@/components/sections/AboutSection";
import ByTheNumber from "@/components/sections/ByTheNumber";
import HeroSection from "@/components/sections/HeroSection";
import MyProcess from "@/components/sections/MyProcess";
import MySuccessStories from "@/components/sections/MySuccessStories";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WhatIOffer from "@/components/sections/WhatIOffer";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <WhyWorkWithMe />
      <ProjectsSection />
      <MyProcess />
      <WhatIOffer />
      <AboutSection />
      <ByTheNumber />
      <MySuccessStories />
    </div>
  );
}
