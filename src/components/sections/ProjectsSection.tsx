// import React from "react";
// import Badge from "../shared/Badge";
// import { assets, projects } from "@/Assets/assets";
// import Image from "next/image";
// import ArrowButton from "../shared/ArrowButton";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import { Github, GithubIcon, Tv } from "lucide-react";

// const ProjectsSection = () => {
//   return (
//     <div className="w-full bg-brand-bg">
//       <div className="w-[94%] md:w-[80%] mx-auto md:py-20 md:10">
//         <div className="flex items-start flex-col">
//           <Badge color="white" text="Selected work 2024-2025" />
//           <h2 className="text-white md:text-7xl text-4xl my-6">
//             Turning Code Into <br /> Craftsmanship
//           </h2>
//           <div className="flex items-center gap-2 flex-wrap  py-6 my-3 justify-center">
//             {projects.map((item, index) => {
//               return (
//                 <div
//                   className="border-[1px] rounded-lg hover:shadow-lg shadow-brand-light/25 hover:border-brand-primary border-gray-500 md:w-120 md:px-2 md:py-2 md:h-110"
//                   key={index}
//                 >
//                   <ArrowButton link={item.liveLink} text={item.title} />
//                   <div className="image rounded-lg mt-2.5 overflow-hidden">
//                     <Image
//                       src={item.image}
//                       height={500}
//                       width={500}
//                       alt="project  image"
//                     />
//                     <div className="">
//                       <p className="text-gray-400 py-5">{item.description}</p>
//                       <div className="flex justify-between">
//                         <Link href={item.githubLink}>
//                           <Button className="bg-white cursor-pointer rounded-full hover:bg-brand-primary  hover:shadow-lg shadow-brand-light/25">
//                             <Github className="w-5 h-5 text-3xl text-black" />
//                             <span className="text-black">Source Code</span>
//                           </Button>
//                         </Link>
//                         <Link href={item.liveLink}>
//                           <Button className="bg-white cursor-pointer rounded-full   hover:shadow-lg shadow-[crimson]/25 hover:bg-[crimson]">
//                             <Tv className="w-5 h-5 text-3xl text-black" />
//                             <span className="text-black">Go Live</span>
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="py-4 w-full mt-4 flex items-center justify-center">
//             <ArrowButton link="/projects" text="View All Projects" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectsSection;

import React from "react";
import Badge from "../shared/Badge";
import { assets, projects } from "@/Assets/assets";
import Image from "next/image";
import ArrowButton from "../shared/ArrowButton";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github, Tv } from "lucide-react";

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
              <div
                key={index}
                className="border-[1px] rounded-lg hover:shadow-lg shadow-brand-light/25 hover:border-brand-primary border-gray-600 p-4"
              >
                <ArrowButton link={item.liveLink} text={item.title} />

                <div className="rounded-lg mt-4 overflow-hidden">
                  <Image
                    src={item.image}
                    alt="project image"
                    width={500}
                    height={300}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>

                <p className="text-gray-400 text-sm mt-4 mb-5">
                  {item.description}
                </p>

                <div className="flex items-center cursor-pointer justify-between gap-3">
                  <Link href={item.githubLink}>
                    <Button className="bg-white rounded-full hover:bg-brand-primary hover:shadow-lg shadow-brand-light/25">
                      <Github className="w-5 h-5 text-black" />
                      <span className="text-black ml-1">Source Code</span>
                    </Button>
                  </Link>
                  <Link href={item.liveLink}>
                    <Button className="bg-white cursor-pointer  rounded-full hover:bg-[crimson] hover:shadow-lg shadow-[crimson]/25">
                      <Tv className="w-5 h-5 text-black" />
                      <span className="text-black ml-1">Go Live</span>
                    </Button>
                  </Link>
                </div>
              </div>
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
