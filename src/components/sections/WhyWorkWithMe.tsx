import React from "react";
import Badge from "../shared/Badge";
import { whyChooseMe } from "@/Assets/assets";
import Image from "next/image";

const WhyWorkWithMe = () => {
  return (
    <div className="w-full bg-brand-gray">
      <div className="w-[94%] md:w-[80%] mx-auto flex flex-col py-20">
        <div className="flex flex-col items-start">
          <Badge color="black" text="Why Choose me" />
          <h2 className="md:text-7xl text-4xl my-6">Why Work with Me</h2>
        </div>
        <div className="flex items-center my-4 gap-4 flex-wrap">
          {whyChooseMe.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white hover:shadow-xl shadow-gray-500 max-w-96 transition-all ease-in-out h-70 p-6 rounded-xl"
              >
                <div className="p-2 bg-brand-primary inline-block rounded-xl">
                  {" "}
                  <Image src={item.image} alt="" width={35} height={35} />
                </div>
                <h3 className="text-xl font-semibold my-4">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyWorkWithMe;
