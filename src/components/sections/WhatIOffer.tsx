import React from "react";
import Badge from "../shared/Badge";
import { whatIOffer } from "@/Assets/assets";
import Image from "next/image";
import ArrowButton from "../shared/ArrowButton";

const WhatIOffer = () => {
  return (
    <div className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto">
        <div className="flex items-start flex-col py-10 md:py-24">
          <Badge text="What i offer" color="white" />
          <h2 className="md:text-7xl my-4 font-medium text-white text-6xl">
            Empowering Brands <br /> Through Modern <br /> Development
          </h2>
          <div className="flex my-10 flex-wrap justify-center  gap-5">
            {whatIOffer.map((item, index) => {
              return (
                <div
                  className="w-96 h-130 hover:border-[1px] border-transparent hover:border-brand-primary hover:text-brand-bg transition-all ease-in-out duration-500 hover:shadow-lg shadow-brand-primary/50 bg-[#1A1A1A] relative md:px-5 px-4 md:py-14 py-16 rounded-xl"
                  key={index}
                >
                  <Image
                    className="absolute top-4"
                    src={item.image}
                    height={50}
                    width={50}
                    alt="offer image"
                  />
                  <div className="">
                    <h3 className="text-white my-3 text-5xl md:text-4xl font-medium">
                      {item.title}
                    </h3>
                    <h5 className="text-white my-3 text-xl">{item.subtitle}</h5>
                    <p className="text-gray-300 py-2">{item.description}</p>
                    <div className="my-2">
                      {item.features.map((item, index) => {
                        return (
                          <h6
                            className="text-gray-200 border-b-[1px] border-gray-600 py-1 my-3 text-center text-xl"
                            key={index}
                          >
                            {item}
                          </h6>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {" "}
                    <ArrowButton
                      text="Schedule a consultation"
                      link="/contact"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIOffer;
