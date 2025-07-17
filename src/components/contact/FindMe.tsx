import { socialLinks } from "@/Assets/assets";
import {
  CornerDownRight,
  Facebook,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const FindMe = () => {
  const iconMap = {
    github: <Github size={24} />,
    linkedin: <Linkedin size={24} />,
    twitter: <Twitter size={24} />,
    facebook: <Facebook size={24} />,
  };

  return (
    <div className="w-full bg-brand-bg px-5 py-12 md:py-20">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
        {/* Email Section */}
        <div className="bg-[#1A1A1A] px-8 md:px-14 py-8 rounded-xl w-full md:w-[48%] text-center md:text-left flex items-center justify-center flex-col">
          <h5 className="uppercase text-lg text-white mb-4">Email Me</h5>
          <a
            href="mailto:razaali.webdev@gmail.com"
            className="inline-flex items-center gap-3 text-xl md:text-2xl text-white border-b border-gray-500 hover:underline transition-all"
          >
            <CornerDownRight size={28} />
            razaali.webdev@gmail.com
          </a>
        </div>

        {/* Social Media Section */}
        <div className="bg-[#1A1A1A] px-8 md:px-14 py-8 rounded-xl w-full md:w-[48%] text-center md:text-left flex items-center justify-center flex-col">
          <h5 className="uppercase text-lg text-white mb-4">Find Me</h5>
          <div className="flex justify-center md:justify-start items-center gap-6">
            {socialLinks.map((social, index) => (
              <Link
                href={social.link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-brand-primary transition-all"
              >
                {iconMap[social.icon]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMe;
