"use client";
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "../ui/button";

const Form = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      )
      .then(
        () => {
          alert("Message sent successfully!");
          formRef.current?.reset();
        },
        (error) => {
          alert("Failed to send message: " + error.text);
        }
      );
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={sendEmail}
        className="w-full mx-auto grid gap-6"
      >
        {/* Name */}
        <div className="w-full">
          <label className="text-white text-base md:text-lg">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            required
            placeholder="Enter your name"
            className="w-full mt-2 px-4 py-3 rounded-md bg-[#1A1A1A] text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="text-white text-base md:text-lg">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full mt-2 px-4 py-3 rounded-md bg-[#1A1A1A] text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Budget */}
        <div className="w-full">
          <label className="text-white text-base md:text-lg">Your Budget</label>
          <input
            type="number"
            name="budget"
            placeholder="Estimate budget"
            className="w-full mt-2 px-4 py-3 rounded-md bg-[#1A1A1A] text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="text-white text-base md:text-lg">Description</label>
          <textarea
            name="description"
            rows={5}
            placeholder="Tell me about your project..."
            className="w-full mt-2 px-4 py-3 rounded-md bg-[#1A1A1A] text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
          ></textarea>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-fit px-6 py-4 rounded-full bg-brand-primary hover:bg-brand-light cursor-pointer text-brand-bg text-lg mt-2 transition-all duration-300"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Form;
