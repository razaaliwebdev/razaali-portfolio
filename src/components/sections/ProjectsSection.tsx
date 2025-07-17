import React from "react";
import Badge from "../shared/Badge";
import { projects } from "@/Assets/assets";
import ArrowButton from "../shared/ArrowButton";
import ProjectCard from "../shared/ProjectCard";

const ProjectsSection = () => {
  return (
    <div className="w-full bg-brand-bg">
      <div className="w-[94%] md:w-[80%] mx-auto py-14 md:py-20">
        <div className="flex items-start flex-col">
          <Badge color="white" text="Selected work 2024–2025" />

          <h2 className="text-white text-3xl md:text-7xl my-6 leading-tight">
            Turning Code Into <br className="hidden md:block" /> Craftsmanship
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full my-6">
            {projects.map((item, index) => (
              <ProjectCard
                key={index}
                title={item.title}
                liveLink={item.liveLink}
                githubLink={item.githubLink}
                image={item.image}
                description={item.description}
              />
            ))}
          </div>

          <div className="py-6 w-full flex justify-center">
            <ArrowButton link="/projects" text="View All Projects" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
