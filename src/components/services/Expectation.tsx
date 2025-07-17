"use client";

import React from "react";
import Badge from "../shared/Badge";
import { expectations } from "@/Assets/assets";
import Image from "next/image";

const Expectation = () => {
  return (
    <div className="w-full bg-brand-gray">
      <div className="w-[94%] md:w-[80%] mx-auto pt-20 pb-16">
        {/* Header Section */}
        <div className="flex flex-col items-start">
          <Badge text="My philosophy" color="black" />
          <h2 className="md:text-7xl text-4xl my-10 font-medium text-brand-bg">
            What to Expect
          </h2>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expectations.map((item, index) => (
            <div
              key={index}
              className="bg-white hover:shadow-2xl transition-all duration-300 px-6 py-8 rounded-xl shadow-md flex flex-col items-start text-left"
            >
              <div className="bg-brand-primary p-4 shadow-xl shadow-gray-400 inline-block rounded-full mb-5">
                <Image
                  src={item.image}
                  width={40}
                  height={40}
                  alt={item.title}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-brand-bg">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expectation;
