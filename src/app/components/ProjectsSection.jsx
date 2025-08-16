"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Growthbot PWA",
    description: "Christian Discipleship Chatbot and Discipler connect App",
    image: "/images/projects/2.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/vik2ry/whatsapp-v2",
    previewUrl: "https://whatsapp-v2-dun.vercel.app/",
  },
  {
    id: 2,
    title: "WhatsApp Web Clone",
    description: "A clone of WhatsApp web",
    image: "/images/projects/3.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/vik2ry/whatsappv2",
    previewUrl: "https://whatsappv2-taupe.vercel.app/",
  },
  {
    id: 3,
    title: "Cospire",
    description: "A B2B Space listing and booking startup",
    image: "/images/projects/4.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/frankarinze/cospire",
    previewUrl: "https://cospire-dev.web.app/",
  },
  {
    id: 4,
    title: "Medium Clone",
    description: "A clone of medium.com",
    image: "/images/projects/5.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/vik2ry/sanitymedium4L",
    previewUrl: "https://sanitymedium4-l.vercel.app/",
  },
  {
    id: 5,
    title: "Tree of wally",
    description: "A social media popularity monitization API",
    image: "/images/projects/1.png",
    tag: ["All", "Backend"],
    gitUrl: "https://github.com/vik2ry/towally",
    previewUrl: "https://treeofwally.com",
  },
  {
    id: 6,
    title: "SpaceX",
    description: "A customized SpaceX landing page from their API",
    image: "/images/projects/6.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/Vik2ry/olusegun_banji-frontend-developer",
    previewUrl: "https://youtu.be/rB2Ornpsnf0",
  },
  {
    id: 7,
    title: "Blogging CRUD API Tutorial",
    description: "A Blog CRUD Application",
    image: "/images/projects/1.png",
    tag: ["All", "Backend"],
    gitUrl: "https://github.com/Vik2ry/nestjs-api-learn",
    previewUrl: "https://nestjs-api-learn.vercel.app/",
  },
  {
    id: 8,
    title: "Koinonia Divine Initiative Website",
    description: "An official website for an international Christian NGO",
    image: "/images/projects/8.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/Vik2ry/kdi",
    previewUrl: "https://v0-ngo-site.vercel.app/",
  },
  {
    id: 9,
    title: "Indigitous Search Engine",
    description: "A Non-copyrighted Search Application",
    image: "/images/projects/9.png",
    tag: ["All", "Fullstack"],
    gitUrl: "",
    previewUrl: "https://v0-indigitoussearch.vercel.app/",
  },
  {
    id: 10,
    title: "Apologist Chatbot Project",
    description: "An AI-powered apologetics chatbot SAS",
    image: "/images/projects/10.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/apologist-project/",
    previewUrl: "https://apologist.ai/",
  },
  {
    id: 11,
    title: "Light Within Her",
    description: "An blog website for healing, therapy and spiritual growth",
    image: "/images/projects/11.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/vik2ry/lightwithinher/",
    previewUrl: "https://lightwithinher.vercel.app/",
  },
  {
    id: 12,
    title: "Scarce2plenty",
    description: "A crowd funding for agricultural goods sales app",
    image: "/images/projects/12.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/vik2ry/scarce2plenty-frontend",
    previewUrl: "https://scarce2plenty.vercel.app/",
  },
  {
    id: 13,
    title: "poll-systems-backend",
    description: "A Django backend for election polls",
    image: "/images/projects/13.png",
    tag: ["All", "Fullstack"],
    gitUrl: "https://github.com/Vik2ry/poll-system-backend",
    previewUrl: "https://www.loom.com/share/9b102d133e0246bb92f5398e12f7cc46?sid=4d234282-df8e-474e-b821-8100932c1ddd",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Fullstack"
          isSelected={tag === "Fullstack"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Backend"
          isSelected={tag === "Backend"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
