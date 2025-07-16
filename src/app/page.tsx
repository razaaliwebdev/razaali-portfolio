import { assets } from "@/Assets/assets";
import HeroSection from "@/components/sections/HeroSection";
import WhyWorkWithMe from "@/components/sections/WhyWorkWithMe";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <WhyWorkWithMe />
    </div>
  );
}
