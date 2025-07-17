import React from "react";
import ArrowButton from "./ArrowButton";
import Image from "next/image";
import Link from "next/link";
import { Github, Tv } from "lucide-react";
import { Button } from "../ui/button";

const ProjectCard = ({
  liveLink,
  title,
  image,
  description,
  githubLink,
}: {
  liveLink: string;
  title: string;
  image: string;
  description: string;
  githubLink: string;
}) => {
  return (
    <div className="border-[1px] rounded-lg hover:shadow-lg shadow-brand-light/25 hover:border-brand-primary border-gray-600 p-4">
      <ArrowButton link={liveLink} text={title} />

      <div className="rounded-lg mt-4 overflow-hidden">
        <Image
          src={image}
          alt="project image"
          width={500}
          height={300}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <p className="text-gray-400 text-sm mt-4 mb-5">{description}</p>

      <div className="flex -center cursor-pointer justify-between gap-3">
        <Link href={githubLink}>
          <Button className="bg-white rounded-full hover:bg-brand-primary hover:shadow-lg shadow-brand-light/25">
            <Github className="w-5 h-5 text-black" />
            <span className="text-black ml-1">Source Code</span>
          </Button>
        </Link>
        <Link href={liveLink}>
          <Button className="bg-white cursor-pointer  rounded-full hover:bg-[crimson] hover:shadow-lg shadow-[crimson]/25">
            <Tv className="w-5 h-5 text-black" />
            <span className="text-black ml-1">Go Live</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
