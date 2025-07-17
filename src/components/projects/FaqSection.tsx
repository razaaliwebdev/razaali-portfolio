import React from "react";
import Badge from "../shared/Badge";
import Accordion from "../shared/Accordion";
import { assets, faqs } from "@/Assets/assets";

const FaqSection = () => {
  return (
    <div className="bg-brand-gray w-full">
      <div className="w-[94%] md:w-[80%] flex md:flex-row flex-col py-10 mx-auto gap-10 md:py-24">
        <div className="md:w-[35%] w-full flex  flex-col items-start">
          <Badge text="faq" color="black" />
          <h2 className="md:text-7xl text-4xl my-4 py-4">
            Questions & Answers
          </h2>
        </div>

        <div className="md:w-[60%] w-full">
          <Accordion
            items={faqs}
            plusIcon={assets.plusIcon}
            minusIcon={assets.minusIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
