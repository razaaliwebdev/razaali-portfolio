"use client";
import React from "react";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  return (
    <Button
      className="fixed bottom-6  hover:bg-brand-primary/80 right-6 z-50 bg-brand-primary  shadow-lg  text-4xl  cursor-pointer transition"
      onClick={() => window.scroll({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="w-6 h-6 text-3xl font-bold text-black" />
    </Button>
  );
};

export default ScrollToTop;
