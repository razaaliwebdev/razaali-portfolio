"use client";
import React, { useState } from "react";
import Image from "next/image";

type AccordionItem = {
  question: string;
  answer: string;
};

interface AccordionProps {
  items: AccordionItem[];
  plusIcon: string;
  minusIcon: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  plusIcon,
  minusIcon,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="overflow-hidden border-b border-gray-500 transition-all duration-500 ease-in-out"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-5 py-4 flex justify-between items-center text-left text-brand-bg text-lg font-semibold"
            >
              <span>{item.question}</span>
              <Image
                src={isOpen ? minusIcon : plusIcon}
                alt="toggle icon"
                className={`transform cursor-pointer transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                width={30}
                height={30}
              />
            </button>

            {/* Animated Content */}
            <div
              className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0"
              }`}
            >
              <p className="text-brand-bg text-base">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
