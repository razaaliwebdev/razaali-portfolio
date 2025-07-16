import { assets } from "@/Assets/assets";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const ArrowButton = ({ link, text }:{ link: string, text: string}) => {
  return (
    <Link href={link}>
      <Button className="mt-5 flex items-center px-6 py-2 rounded-full bg-brand-primary hover:bg-brand-light text-black cursor-pointer text-lg">
        <Image src={assets.arrow} width={20} height={20} alt="arrow" />
        {text}
      </Button>
    </Link>
  );
};

export default ArrowButton;
