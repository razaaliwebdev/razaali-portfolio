"use client";

import { services } from "@/Assets/assets";
import Image from "next/image";
import React from "react";

const ServicesSection = () => {
  return (
    <div className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto pt-30 pb-16">
        <h1 className="text-5xl md:text-[10rem] text-white uppercase leading-none text-center md:text-left">
          Services
        </h1>

        <div className="mt-16 grid md:grid-cols-2 gap-10">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-gray-600 hover:border-brand-primary transition-all hover:shadow-md shadow-brand-primary duration-300 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl text-white font-semibold mb-2">
                    {item.title}
                  </h2>
                  <Image
                    src={item.image}
                    alt="service icon"
                    width={110}
                    height={110}
                  />
                </div>
                <h4 className="text-xl text-gray-300 mb-4">{item.subtitle}</h4>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {item.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <p className="text-brand-primary text-lg font-medium mt-6">
                Starting at: {item.startingPrice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
