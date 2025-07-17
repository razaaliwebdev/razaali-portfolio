import ContactForm from "@/components/contact/ContactForm";
import FaqSection from "@/components/projects/FaqSection";
import React from "react";

const page = () => {
  return (
    <div className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto pt-30 pb-14">
        <h1 className=" text-5xl md:text-[10rem] text-white uppercase leading-none text-center md:text-left">
          Contact
        </h1>
        <ContactForm />
      </div>
      <div className="">
        <FaqSection />
      </div>
    </div>
  );
};

export default page;
