"use client";

import React from "react";
import Badge from "../shared/Badge";
import { whatIOffer } from "@/Assets/assets";
import Image from "next/image";
import ArrowButton from "../shared/ArrowButton";

const WhatIOffer = () => {
  return (
    <section className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto">
        <div className="flex flex-col items-start py-10 md:py-24">
          <Badge text="What I Offer" color="white" />
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white my-4 leading-tight">
            Empowering Brands <br /> Through Modern <br /> Development
          </h2>

          {/* Card Grid */}
          <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {whatIOffer.map((item, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A] rounded-xl px-6 py-14 hover:border hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/30 transition-all relative flex flex-col justify-between h-full"
              >
                {/* Icon */}
                <Image
                  className="absolute top-6 left-6"
                  src={item.image}
                  height={50}
                  width={50}
                  alt="Offer icon"
                />

                {/* Content */}
                <div className="mt-14">
                  <h3 className="text-white text-3xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <h5 className="text-white text-lg mb-4">{item.subtitle}</h5>
                  <p className="text-gray-300 text-base mb-4">
                    {item.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {item.features.map((feature, i) => (
                      <h6
                        key={i}
                        className="text-gray-200 text-center border-b border-gray-600 py-1 text-lg"
                      >
                        {feature}
                      </h6>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-6 flex justify-center">
                  <ArrowButton text="Schedule a consultation" link="/contact" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIOffer;
