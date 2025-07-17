import { experience } from "@/Assets/assets";
import Badge from "@/components/shared/Badge";
import React from "react";

const Experience = () => {
  return (
    <div className="bg-brand-gray w-full md:py-24 py-12 px-5">
      <div className="md:w-[80%] w-[94%] mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-start text-left">
          <Badge text="Experience" color="black" />
          <h2 className="md:text-5xl text-3xl font-semibold my-5">
            My Work Experience
          </h2>
        </div>

        {/* Experience List */}
        {experience.map((exp, expIndex) => (
          <div
            key={expIndex}
            className="flex flex-col md:flex-row gap-10 border-b border-gray-300 pb-10"
          >
            {/* Left: Role & Company */}
            <div className="md:w-[35%] w-full">
              <h3 className="text-lg font-semibold text-black">{exp.role}</h3>
              <p className="text-brand-bg font-medium">{exp.company}</p>
              <p className="text-gray-700 text-sm mt-1">{exp.duration}</p>
            </div>

            {/* Right: Descriptions */}
            <div className="md:w-[65%] w-full">
              {exp.description.map((item, index) => (
                <p
                  key={index}
                  className="text-base md:text-lg font-medium text-brand-bg leading-relaxed my-2"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
