import { testimonials } from "@/Assets/assets";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const MySuccessStories = () => {
  return (
    <div className="bg-brand-bg w-full py-10 md:pt-20 md:pb-12">
      <div className="w-[94%] md:w-[80%] mx-auto flex flex-col md:flex-row gap-7">
        {/* Text Block */}
        <div className="flex-1 min-h-[380px] bg-[#1A1A1A] border border-gray-500 rounded-xl px-5 py-7 md:px-6 md:py-10 flex flex-col justify-between">
          <h2 className="text-white text-3xl md:text-4xl font-semibold mb-4">
            My Success <br /> Stories
          </h2>
          <p className="text-white text-base leading-relaxed">
            Crafting Impactful Experiences Across Industries — from ambitious
            startups to renowned enterprises, I’ve partnered with clients who
            value innovation, reliability, and results. Every project reflects a
            story of collaboration, creativity, and measurable impact — and I’m
            just getting started.
          </p>
        </div>

        {/* Testimonials */}
        {testimonials.map((test, index) => (
          <div
            key={index}
            className="flex-1 min-h-[380px] bg-[#1A1A1A] border border-transparent hover:border-brand-primary shadow-lg hover:shadow-2xl rounded-xl px-5 py-7 md:px-6 md:py-10 flex flex-col justify-between"
          >
            {/* Stars */}
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={20} className="text-brand-primary" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white text-base mb-6">{test.quote}</p>

            {/* User Info */}
            <div className="border-t border-gray-500 pt-5 flex items-center gap-4">
              <Image
                className="rounded-full w-16 h-16 object-cover"
                src={test.image}
                height={64}
                width={64}
                alt="testimonial"
              />
              <div>
                <p className="text-white text-lg font-semibold">{test.name}</p>
                <p className="text-white text-sm mt-1">
                  {test.position} at {test.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySuccessStories;
