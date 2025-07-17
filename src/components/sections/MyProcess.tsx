import React from "react";
import Badge from "../shared/Badge";
import ArrowButton from "../shared/ArrowButton";
import { myProcess } from "@/Assets/assets";

const MyProcess = () => {
  return (
    <div className="bg-brand-gray w-full">
      <div className="w-[94%] md:w-[80%] px:5 md:px-0 gap-5 flex flex-wrap justify-between mx-auto md:py-20 py-8">
        <div className="flex items-start flex-col md:w-[45%] w-[97%]">
          <Badge text="My Process" color="black" />
          <h2 className="md:text-8xl text-4xl my-6">
            My Creative <br /> Worlkflow
          </h2>
          <ArrowButton link="/contact" text="Schedule consultation" />
        </div>
        <div className="w-[97%] md:w-[50%]">
          {myProcess.map((item, index) => {
            return (
              <div
                className="my-10 border-b-[1px] border-gray-500 py-3"
                key={index}
              >
                <h2 className="md:text-3xl text-4xl font-medium my-2">
                  {item.step}. {item.title}
                </h2>
                <div className="text-gray-600">{item.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyProcess;
