import { byTheNumber } from "@/Assets/assets";
import React from "react";

const ByTheNumber = () => {
  return (
    <div className="w-full bg-gradient-to-b from-brand-primary to-brand-light">
      <div className="w-[94%] md:w-[80%] mx-auto gap-10 items-center justify-center flex-col  md:flex-row flex md:py-20 py-10">
        {byTheNumber.map((num, index) => {
          return (
            <div className="text-center" key={index}>
              <h2 className="md:text-7xl text-4xl  font-medium py-5 md:my-5 md:py-2">
                {num.value}
              </h2>
              <div className="border-t-[1px] text-left border-black my-3">
                <h3 className="my-3 py-2 text-4xl">{num.label}</h3>
                <p className="text-lg"> {num.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ByTheNumber;
