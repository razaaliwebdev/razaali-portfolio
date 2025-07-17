import { about, assets } from "@/Assets/assets";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { CornerDownRight } from "lucide-react";

const AboutHeroSection = () => {
  return (
    <div className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto py-14 md:pt-32 md:pb-20">
        {/* Heading */}
        <h1 className="text-5xl md:text-[10rem] text-white uppercase leading-none text-center md:text-left">
          About
        </h1>

        {/* Content Block */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 mt-10 items-center">
          {/* Image Section */}
          <div className="w-full md:w-[35%]">
            <div className="bg-gradient-to-b from-brand-primary to-brand-light rounded-xl overflow-hidden pt-10 relative">
              <Image
                src={assets.hero}
                alt="hero"
                width={500}
                height={600}
                className="rounded-bl-2xl rounded-br-2xl opacity-80 object-cover w-full"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full md:w-[65%] text-center md:text-left">
            <h2 className="text-4xl md:text-6xl text-white font-medium mb-6">
              {about.subtitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-6">
              {about.description}
            </p>

            <div className="flex md:block items-center justify-center w-full">
              <a href="/Raza_Ali_Resume.pdf" download>
                <Button className="px-6  cursor-pointer py-3 flex items-center gap-2 rounded-full bg-brand-primary hover:bg-brand-light text-black text-base md:text-lg">
                  <CornerDownRight size={20} />
                  Download Resume
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeroSection;
