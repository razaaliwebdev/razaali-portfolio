"use client";

import React, { useEffect, useState } from "react";
import { assets, links } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { AlignJustify, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ✅ Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

  return (
    <nav className="w-full bg-brand-bg md:h-[5.5rem] h-[4rem] relative z-50">
      <div className="md:w-[80%] w-[94%] h-full mx-auto flex items-center justify-between md:px-0 px-4">
        {/* Logo */}
        <Link href="/" className="logo">
          <Image
            src={assets.logo}
            width={200}
            height={80}
            className="w-24 scale-105 md:w-40"
            alt="logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              className={`${
                pathname === link.path
                  ? "text-brand-primary font-medium"
                  : "nav-link text-white hover:text-brand-light font-light text-lg"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact">
            <Button className="bg-transparent rounded-full border border-white px-5 py-2.5 hover:bg-brand-primary hover:border-brand-bg hover:text-brand-bg">
              Contact Me
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button type="button" onClick={toggleSidebar}>
            <AlignJustify className="w-8 h-8 text-brand-primary hover:text-brand-light" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-[300px] bg-brand-bg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Image
            src={assets.logo}
            alt="logo"
            width={140}
            height={60}
            className="w-28"
          />
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-white hover:text-brand-primary" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {links.map((link, index) => (
            <Link
              href={link.path}
              key={index}
              onClick={closeSidebar}
              className={`${
                pathname === link.path
                  ? "text-brand-primary font-medium"
                  : "text-white hover:text-brand-light font-light text-lg"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link href="/contact" onClick={closeSidebar}>
            <Button className="w-full mt-4 bg-transparent border border-white text-white hover:bg-brand-primary hover:text-brand-bg rounded-full hover:border-brand-bg">
              Contact Me
            </Button>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}
    </nav>
  );
};

export default Navbar;
