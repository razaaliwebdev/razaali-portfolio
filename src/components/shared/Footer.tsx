"use client";
import React from "react";
import Badge from "./Badge";
import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import { assets, links } from "@/Assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="w-full bg-[#1A1A1A] pt-16 md:pt-24 pb-5">
      {/* Top CTA Section */}
      <div className="w-[94%] md:w-[80%] bg-brand-bg rounded-xl mx-auto my-10 py-8 md:py-12 px-5 flex flex-col items-center text-center">
        <Badge color="white" text="Have Project in Mind?" />
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium text-white py-5 leading-tight">
          Let’s Turn your Ideas <br /> into Reality
        </h2>
        <div className="mt-3 md:mt-6">
          <a
            href="mailto:razaali.webdev@gmail.com"
            className="flex items-center gap-3 text-xl md:text-3xl text-white border-b border-gray-500 hover:underline"
          >
            <CornerDownRight size={28} />
            razaali.webdev@gmail.com
          </a>
        </div>
      </div>

      {/* Navigation Links and Logo */}
      <div className="w-[94%] md:w-[80%] mx-auto border-t border-gray-700 pt-10 md:pt-14 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Image src={assets.logo} height={80} width={80} alt="logo" />

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-5 md:gap-10">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className={
                pathname === link.path
                  ? "text-brand-primary font-semibold text-base md:text-lg"
                  : "text-white hover:text-brand-light text-base md:text-lg"
              }
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright Line */}
      <div className="w-[94%] md:w-[80%] mx-auto mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-5">
        &copy; {new Date().getFullYear()} Raza Ali. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
