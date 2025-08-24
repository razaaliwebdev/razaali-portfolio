"use client";

import React, { useState } from "react";
import { projects } from "@/Assets/assets";
import ProjectCard from "@/components/shared/ProjectCard";
import FaqSection from "@/components/projects/FaqSection";

// app/projects/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Raza Ali - Web Developer Portfolio",
  description:
    "Browse projects by Raza Ali showcasing expertise in MERN Stack, Next.js, and modern full stack web development.",
};

const categories = ["All", "Frontend", "Backend", "Full Stack"];

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <div className="w-full bg-brand-bg min-h-screen">
        <div className="w-[94%] md:w-[80%] mx-auto md:pt-32 md:pb-14">
          {/* Page Title */}
          <h1 className="text-5xl md:text-[12rem] text-white uppercase leading-none text-center md:text-left py-20">
            Projects
          </h1>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start pb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`text-xl cursor-pointer ${
                  selectedCategory === cat ? "text-white" : "text-gray-600"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Cards */}
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                liveLink={project.liveLink}
                githubLink={project.githubLink}
                image={project.image}
                description={project.description}
              />
            ))}
          </div>
        </div>
      </div>
      <FaqSection />
    </>
  );
};

export default ProjectsPage;
