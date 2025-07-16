import React from "react";
import Badge from "../shared/Badge";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import ArrowButton from "../shared/ArrowButton";
import ScrollToTop from "../shared/ScrollToTop";

const HeroSection = () => {
  return (
    <div className="bg-brand-bg w-full h-full">
      {/* Top Section */}
      <div className="w-[94%] md:w-[80%] pt-5 md:pt-16 md:h-[70vh] mx-auto flex flex-col items-center justify-center text-center">
        <Badge color="white" text="Available for Work" />

        <h1 className="text-white uppercase font-extrabold pt-7 md:leading-[170px] text-[42px] sm:text-[64px] md:text-[96px] lg:text-[140px] xl:text-[180px] audio">
          Raza <br />
          <span className="text-brand-primary">Ali</span>ⓒ
        </h1>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16 w-[94%] md:w-[80%] mx-auto mt-10 md:mt-20">
        {/* Text Column */}
        <div className="md:w-[35%] w-full text-center md:text-left">
          <h3 className="text-brand-primary text-xl py-3">
            Where Code Meets Creativity
          </h3>
          <p className="text-white text-base md:text-lg">
            I craft modern full-stack web apps using the MERN stack, blending
            clean code with sleek UI to build high-performing, responsive, and
            conversion-driven websites.
          </p>
          <div className="mt-6 flex justify-center md:justify-start">
            <ArrowButton link="/contact" text="Hire Me" />
          </div>
        </div>

        <div className="w-full flex justify-center md:justify-center items-center relative">
          {/* ✅ Mobile View: Phone Frame with Hero Inside */}
          <div className="relative w-[220px] sm:w-[280px] md:hidden">
            {/* Phone Frame PNG */}
            <Image
              src={assets.mobile}
              alt="mobile-frame"
              width={280}
              height={560}
              className="w-full h-auto z-10 relative"
            />

            {/* Hero inside the phone */}
            <div className="absolute bottom-[2%] left-[5%] w-[90%] h-[85%] overflow-hidden rounded-[2rem] z-0 opacity-20">
              <Image
                src={assets.hero}
                alt="hero-in-frame"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* ✅ Desktop View: Large Transparent Hero Positioned Near Heading */}
          {/* ✅ Desktop View: Transparent Hero Positioned Near Heading */}
          <div className="hidden md:flex flex-col items-center relative -mt-64">
            <Image
              src={assets.hero}
              width={800}
              height={800}
              alt="hero-desktop-transparent"
              className="w-[480px] md:w-[500px] lg:w-[600px] xl:w-[720px] h-auto opacity-15 object-cover"
            />
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default HeroSection;
