import React from "react";
import Badge from "../shared/Badge";
import Form from "../forms/Form";

const ContactForm = () => {
  return (
    <div className="w-full bg-brand-bg px-5 md:px-0 py-12 md:py-20">
      <div className="w-[94%] md:w-[80%] mx-auto flex flex-col md:flex-row gap-10">
        {/* Left: Heading & Badge */}
        <div className="md:w-[45%] w-full flex flex-col items-start">
          <Badge text="Book a call" color="white" />
          <h2 className="md:text-7xl text-4xl text-white font-semibold mt-5">
            I'd love to hear from you!
          </h2>
        </div>

        {/* Right: Form */}
        <div className="md:w-[50%] w-full">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
