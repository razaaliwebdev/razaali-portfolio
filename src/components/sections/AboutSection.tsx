import { about, assets, socialLinks } from "@/Assets/assets";
import Image from "next/image";
import React from "react";
import Badge from "../shared/Badge";
import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";

const AboutSection = () => {
  const iconMap = {
    github: <Github size={20} />,
    linkedin: <Linkedin size={20} />,
    twitter: <Twitter size={20} />,
    facebook: <Facebook size={20} />,
  };
  return (
    <div className="w-full bg-brand-gray ">
      <div className="w-[94%] md:w-[80%] flex md:flex-row flex-col gap-10  mx-auto md:py-20 py-10">
        <div className="w-full md:w-[35%] ">
          <div className="image bg-gradient-to-b from-brand-primary rounded-xl overflow-hidden pt-10 relative to-brand-light">
            <Image
              src={assets.hero}
              alt="hero"
              width={500}
              className="rounded-bl-3xl rounded-br-3xl  opacity-60"
              height={600}
            />
          </div>
        </div>
        <div className="w-full md:w-[65%] md:px-0 px-10 flex items-start flex-col">
          <Badge color="black" text={about.heading} />
          <h2 className="my-4 md:text-7xl text-5xl font-medium">
            {about.subtitle}
          </h2>{" "}
          <p className="">{about.description}</p>
          <div className="socila-links flex items-center my-5 gap-5">
            {socialLinks.map((item, index) => {
              return (
                <div
                  className="bg-brand-bg text-2xl rounded-full p-3 border-[1px] shadow-2xl shadow-gray-600 text-white"
                  key={index}
                >
                  <Link className="" href={item.link}>
                    {iconMap[item.icon]}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
