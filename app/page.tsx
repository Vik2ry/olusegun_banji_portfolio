"use client";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Menu,
  X,
  MessageCircle,
  Mail,
  MapPin,
  ChevronUp,
  Lock,
  Boxes,
  Globe,
} from "lucide-react";

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showReturnToTop, setShowReturnToTop] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-100px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          // Add animation class when section comes into view
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate stars
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      vx: number;
      vy: number;
    }> = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update star positions
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.opacity =
          0.3 + Math.abs(Math.sin(Date.now() * 0.001 + star.x)) * 0.5;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      // Draw constellation lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const star1 = stars[i];
          const star2 = stars[j];
          const distance = Math.sqrt(
            Math.pow(star1.x - star2.x, 2) + Math.pow(star1.y - star2.y, 2)
          );

          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.3;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach((star) => {
        ctx.globalAlpha = star.opacity;

        // Outer glow
        ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const projectIndex = Number.parseInt(
            entry.target.getAttribute("data-project-index") || "0"
          );
          setVisibleProjects((prev) => {
            if (!prev.includes(projectIndex)) {
              return [...prev, projectIndex].sort((a, b) => a - b);
            }
            return prev;
          });
        }
      });
    }, observerOptions);

    // Observe all project cards
    const projectCards = document.querySelectorAll("[data-project-index]");
    projectCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      // Load EmailJS dynamically
      const emailjs = await import("@emailjs/browser");

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.get("name"),
          from_email: formData.get("email"),
          message: formData.get("message"),
        },
        process.env.EMAILJS_PUBLIC_KEY!
      );

      alert("Message sent successfully!");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector(".parallax-bg") as HTMLElement;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      setShowReturnToTop(scrolled > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
      <div className="parallax-bg fixed inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          }}
        />
      </div>

      {/* Navigation - matching target site exactly */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="relative max-w-[150px] sm:max-w-[120px] md:max-w-none overflow-hidden">
              <div className="text-xl font-bold text-blue-400 opacity-100 sm:opacity-70 md:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Olusegun Banji
              </div>
              {/* Gradient fade overlay for smaller screens */}
              <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-900/90 to-transparent pointer-events-none md:hidden"></div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 text-sm">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "services", label: "Services" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "projects", label: "Projects" },
                { id: "case-studies", label: "Case Studies" },
                { id: "feed-posts", label: "Feed Posts" },
                { id: "hire-me", label: "Hire Me" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`hover:text-blue-400 transition-all duration-300 relative ${
                    activeSection === item.id ? "text-blue-400" : ""
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 animate-scale-x"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Social icons and mobile menu */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/vik2ry"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/olusegun-banji/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/olusegun_banji"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/2349160664513"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden hover:text-blue-400 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 animate-slide-down">
            <div className="px-6 py-4 space-y-2">
              {[
                "home",
                "about",
                "services",
                "skills",
                "experience",
                "projects",
                "case-studies",
                "feed-posts",
                "hire-me",
                "contact",
              ].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left py-2 hover:text-blue-400 transition-colors capitalize ${
                    activeSection === section ? "text-blue-400" : ""
                  }`}
                >
                  {section.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 animate-fade-in-up">
            <img
              src="/images/hero-image.png"
              alt="Olusegun Banji"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-6 border-4 border-blue-400 shadow-lg shadow-blue-400/20"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up animation-delay-200">
            <span className="text-blue-400">Olusegun</span> Banji
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-4 px-2 animate-fade-in-up animation-delay-400">
            Full Stack Engineer &amp; Team Lead
          </p>
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 animate-fade-in-up animation-delay-400">
            I build dependable platforms and lead the teams and communities
            behind them. Currently leading full stack engineering at MangoZest
            Labs and building as a Senior Full Stack Engineer at Cliniec Health
            Solutions.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 px-2 animate-fade-in-up animation-delay-400">
            React.js • Node.js • NestJS • Next.js • Django • TypeScript
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-600 px-4">
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            About
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/about-image.png"
                alt="About Olusegun Banji"
                className="rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md mx-auto"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Hello, I'm Olusegun Banji
              </h3>
              <p className="text-slate-300 leading-relaxed">
                I build AI-powered software for people most products quietly
                leave out, and I lead the teams that build it. Right now I lead
                full stack engineering on Andromeda, a hospitality and travel
                platform, at MangoZest Labs, work as a Senior Full Stack
                Engineer at Cliniec Health Solutions, and am CEO and Lead
                Software Engineer of two ventures: AfriMentor AI and
                Scarce2plenty, an agricultural crowdfunding and marketplace
                platform that connects farmers directly with buyers.
              </p>
              <p className="text-slate-300 leading-relaxed">
                AfriMentor AI began as my MSSE capstone: a smartphone-first,
                voice-note-driven LLM mentor for low-income African
                entrepreneurs, built for low-end Android phones and patchy 3G
                networks. I led the four-person, three-country team behind it.
                Our research found that automatic LLM-as-judge scores and
                blinded human ratings of persona quality disagree, which matters
                for anyone evaluating persona-aligned models. Both papers are
                being prepared for arXiv.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Beyond the day job, I'm a community builder. With Indigitous I
                founded and lead the Ife chapter, lead the South West region,
                and served as a National Indigitous Mobilizer. At Cospire, my
                work on a 5-step booking flow lifted completion by 50% and
                revenue by 20%. I put as much energy into coaching teammates
                toward their next steps as into the code.
              </p>
              <p className="text-slate-300 leading-relaxed">
                I'm completing an MSSE at Quantic School of Business and
                Technology (Distinction expected September 2026) and hold a BSc
                in Computer Science with Economics from Obafemi Awolowo
                University (2024).
              </p>
              <div className="flex space-x-4 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open("https://github.com/vik2ry", "_blank")
                  }
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/olusegun-banji/",
                      "_blank"
                    )
                  }
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/2349160664513", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Web Development",
                description:
                  "Building robust and scalable web applications with full-stack backends and slick frontends",
                icon: "🌐",
              },
              {
                title: "API & Backend Integration",
                description:
                  "Crafting secure and maintainable APIs, handling authentication, databases, and business logic",
                icon: "🔧",
              },
              {
                title: "PWA & UX Enhancement",
                description:
                  "Designing Progressive Web Apps with smooth interactivity and offline readiness",
                icon: "⚡",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-400">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              "JavaScript",
              "FastAPI",
              "TypeScript",
              "Python",
              "React.js",
              "Next.js",
              "Node.js",
              "NestJS",
              "Django",
              "Prisma",
              "Tailwind CSS",
              "Firebase",
              "PostgreSQL",
              "MongoDB",
              "Supabase",
              "MySQL",
              "Vercel",
              "Render",
              "Git",
              "GitHub",
              "Postman",
              "VS Code",
              "Docker",
              "Turborepo",
              "OpenAPI",
              "Google Maps API",
              "Microservices",
              "PWA",
              "LLM Fine-tuning (RLHF/DPO)",
              "Team Leadership",
            ].map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="p-3 text-center bg-slate-800/30 text-blue-400 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-blue-400">
            Experience
          </h2>
          <div className="space-y-8">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Senior Full Stack Engineer
                    </h3>
                    <p className="text-lg text-slate-300">
                      Cliniec Health Solutions · Remote
                    </p>
                  </div>
                  <span className="text-slate-400 text-lg">
                    Aug 2026 - Present
                  </span>
                </div>
                <div className="text-slate-300 space-y-3 leading-relaxed mt-6">
                  <p>
                    • Converted the Cliniec product into a pnpm/Turborepo monorepo of seven Next.js apps and shared packages (UI kit, typed API client, geo data, config)
                  </p>
                  <p>
                    • Built the Pharmacy, Lab and Hospital portals from Figma designs, including dashboards, appointments, results, messaging and reports, and wired the Hospital app to the hospital API
                  </p>
                  <p>
                    • Redesigned the public marketing site and built its portal picker for each vertical
                  </p>
                  <p>
                    • Set up Vercel deployments and a GitHub Actions workflow that mirrors main to a deploy repository
                  </p>
                  <p>
                    • Addressed code-review findings, including a timezone bug, swallowed errors and CI coverage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Lead Full Stack Software Engineer
                    </h3>
                    <p className="text-lg text-slate-300">MangoZest Labs</p>
                  </div>
                  <span className="text-slate-400 text-lg">
                    Jan 2026 - Present
                  </span>
                </div>
                <div className="text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    • Lead full stack engineering on Andromeda, a hospitality
                    and travel platform
                  </p>
                  <p>
                    • Work across a Turborepo/pnpm monorepo of six Next.js
                    portals backed by a NestJS, Prisma and PostgreSQL API
                  </p>
                  <p>
                    • Secure the admin portal with TOTP two-factor
                    authentication
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="font-semibold text-blue-300 mb-1">
                      Research Software Engineer
                    </h4>
                    <p className="text-slate-400 text-sm mb-3">
                      Sep 2025 - Jan 2026 · Virtual Call Center
                    </p>
                  </div>
                  <p>
                    • Contributed to research and development of backend and AI
                    infrastructure for a Virtual Call Center
                  </p>
                  <p>
                    • Designed the system architecture for a proposed
                    self-hosted AI engine and acted as the bridge between the
                    system under active development and the proposed engine
                  </p>
                  <p>
                    • Published OpenAPI/Swagger documentation for the Virtual
                    Call Center and Andromeda backends
                  </p>
                  <p>
                    • Collaborated with cross-functional teams to integrate new
                    technologies into existing services
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Fullstack Engineer
                    </h3>
                    <p className="text-lg text-slate-300">Cospire</p>
                    <p className="text-slate-400 text-sm">
                      Previously Software Engineering Intern, Sep 2023 - Nov
                      2023
                    </p>
                  </div>
                  <span className="text-slate-400 text-lg">
                    Dec 2023 - Sep 2025
                  </span>
                </div>
                <div className="text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    • Re-architected backend routing layer with Express.js,
                    reducing API latency to sub-200ms
                  </p>
                  <p>
                    • Integrated 7+ external APIs (Firebase, Brevo, Google Maps,
                    OpenStreetMap) to enhance platform services
                  </p>
                  <p>
                    • Led the development of a 5-step booking flow, boosting
                    completion rate by 50%
                  </p>
                  <p>
                    • Optimized and secured SSO workflows with OAuth, cutting
                    login errors by 60%
                  </p>
                  <p>
                    • Contributed to MVP2, helping secure 10+ early adopters and
                    3+ coworking partnerships
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Key Achievements:
                    </h4>
                    <p>
                      • Increased platform revenue by 20% through improved
                      booking flow
                    </p>
                    <p>
                      • Reduced third-party request failures by 30% with
                      resilient integrations
                    </p>
                    <p>
                      • Recognized by leadership for driving user adoption and
                      platform growth
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Software Engineer (Volunteer)
                    </h3>
                    <p className="text-lg text-slate-300">Indigitous</p>
                  </div>
                  <span className="text-slate-400 text-lg">
                    Mar 2022 - Present
                  </span>
                </div>
                <div className="text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    • Spearheaded development of a chatbot platform and
                    real-time chat interface used by 500+ global users
                  </p>
                  <p>
                    • Integrated OAuth providers (Google and Facebook) to
                    streamline user onboarding
                  </p>
                  <p>
                    • Built server-side rendered pages, improving SEO and page
                    performance
                  </p>
                  <p>
                    • Designed and maintained a scalable social-media-like data
                    model
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Key Achievements:
                    </h4>
                    <p>
                      • Reduced login drop-off by 35% with improved OAuth flows
                    </p>
                    <p>
                      • Increased page load performance by 45% and SEO ranking
                      by 30%
                    </p>
                    <p>
                      • Co-led a 6-person dev team, achieving Top 8 placement in
                      a global hackathon across 50+ cities
                    </p>
                    <p>
                      • Supported 1,000+ monthly social interactions through
                      backend optimizations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-blue-400">
                    Community Leadership
                  </h3>
                  <p className="text-lg text-slate-300">Indigitous</p>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  {[
                    {
                      role: "Ife Indigitous Lead and Founder",
                      date: "Jan 2023 - Present",
                    },
                    {
                      role: "South West Indigitous Lead",
                      date: "Jan 2024 - Present",
                    },
                    {
                      role: "National Indigitous Mobilizer",
                      date: "Oct 2025 - Jul 2026",
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                      className="flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                      <p>• {item.role}</p>
                      <span className="text-slate-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-400">
                      AI/ML Engineer & Fullstack Developer
                    </h3>
                    <p className="text-lg text-slate-300">CISRG</p>
                  </div>
                  <span className="text-slate-400 text-lg">
                    Mar 2021 - Dec 2022
                  </span>
                </div>
                <div className="text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    • Built and deployed a GPT-2-based chatbot API handling
                    1,000+ monthly conversations across Messenger and Telegram
                  </p>
                  <p>
                    • Designed and implemented 10+ Flask RESTful endpoints with
                    OAuth 2.0 authentication
                  </p>
                  <p>
                    • Fine-tuned LLM prompts to improve chatbot accuracy and
                    retention
                  </p>
                  <p>
                    • Collaborated with a research team of 5+ on AI/ML projects
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Key Achievements:
                    </h4>
                    <p>
                      • Improved chatbot accuracy by ~40%, reducing user
                      confusion
                    </p>
                    <p>
                      • Increased backend scalability and security through API
                      design
                    </p>
                    <p>
                      • Co-authored 4 peer-reviewed publications, all scoring
                      above 65% in external evaluations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Projects
          </h2>
          {/* Featured: Cliniec monorepo (live sites linked; source is private) */}
          <Card className="bg-slate-800/30 border-blue-400/40 mb-10 sm:mb-12 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-blue-400/20 text-blue-300 border border-blue-400/40 hover:bg-blue-400/20">
                  <Boxes className="w-3 h-3 mr-1" />
                  Featured Monorepo
                </Badge>
                <Badge
                  variant="outline"
                  className="border-emerald-400/60 text-emerald-300"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-3">
                Cliniec Health
              </h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl mb-8">
                A centralized healthcare technology platform for pharmacies,
                laboratories and hospitals, built as a pnpm and Turborepo
                monorepo of seven Next.js apps that share one design system and
                a typed API client.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {[
                  {
                    name: "Marketing Site",
                    role: "Public site with a portal picker for each vertical",
                    href: "https://www.cliniechealth.com",
                  },
                  {
                    name: "Pharmacy Portal",
                    role: "Pharmacy and stores dashboard",
                    href: "https://cliniec-pharmacy.vercel.app",
                  },
                  {
                    name: "Lab Portal",
                    role: "Labs and diagnostics: appointments, results, messages and directory",
                    href: "https://cliniec-lab.vercel.app",
                  },
                  {
                    name: "Hospital Portal",
                    role: "Hospitals and emergencies portal with departments and reports",
                    href: "https://cliniec-hospital.vercel.app",
                  },
                  {
                    name: "In Progress",
                    role: "Specialist, patient and admin apps",
                    href: "",
                  },
                  {
                    name: "Shared Packages",
                    role: "UI kit, typed API client, geo data and config",
                    href: "",
                  },
                ].map((workspace) =>
                  workspace.href ? (
                    <a
                      key={workspace.name}
                      href={workspace.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-lg border border-slate-700/50 bg-slate-900/40 p-4 transition-colors hover:border-blue-400/60 hover:bg-slate-900/70"
                    >
                      <p className="font-semibold text-blue-300 text-sm mb-1 flex items-center justify-between">
                        {workspace.name}
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {workspace.role}
                      </p>
                    </a>
                  ) : (
                    <div
                      key={workspace.name}
                      className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4"
                    >
                      <p className="font-semibold text-blue-300 text-sm mb-1">
                        {workspace.name}
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {workspace.role}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Turborepo",
                  "pnpm Workspaces",
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "OpenAPI",
                  "Figma",
                  "GitHub Actions",
                  "Vercel",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-slate-600 text-slate-300 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="rounded-lg border border-blue-400/30 bg-blue-400/5 p-5 sm:p-6">
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  The sites above are live. The source is a private company
                  repository, so get in touch if you would like a walkthrough.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() =>
                      window.open("https://www.cliniechealth.com", "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit cliniechealth.com
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                    onClick={() =>
                      window.open(
                        "https://wa.me/2349064171781?text=" +
                          encodeURIComponent(
                            "Hi Olusegun, I saw the Cliniec monorepo on your portfolio and I'd like to know more."
                          ),
                        "_blank"
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask me about it
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured: AfriMentor AI (team-led project) */}
          <Card className="bg-slate-800/30 border-blue-400/40 mb-10 sm:mb-12 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-blue-400/20 text-blue-300 border border-blue-400/40 hover:bg-blue-400/20">
                  Featured Project
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-500 text-slate-300"
                >
                  Team Lead
                </Badge>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-3">
                AfriMentor AI
              </h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl mb-8">
                I led a four-person team across three countries to build
                AfriMentor AI, an AI-powered platform designed to work on
                low-end Android phones and 3G networks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  {
                    name: "Architecture",
                    role: "13-microservice, event-driven system",
                  },
                  {
                    name: "Access",
                    role: "PWA built for low-end Android devices and 3G",
                  },
                  {
                    name: "AI alignment",
                    role: "RLHF/DPO persona alignment on Qwen2.5-7B",
                  },
                  {
                    name: "Cost",
                    role: "Infrastructure cost cut from about $4,500/mo to near $0",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4"
                  >
                    <p className="font-semibold text-blue-300 text-sm mb-1">
                      {item.name}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {item.role}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Microservices",
                  "Event-driven",
                  "PWA",
                  "Qwen2.5-7B",
                  "RLHF",
                  "DPO",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-slate-600 text-slate-300 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured: Andromeda monorepo (private — details available on request) */}
          <Card className="bg-slate-800/30 border-blue-400/40 mb-10 sm:mb-12 overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-blue-400/20 text-blue-300 border border-blue-400/40 hover:bg-blue-400/20">
                  <Boxes className="w-3 h-3 mr-1" />
                  Featured Monorepo
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-500 text-slate-300"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-500 text-slate-300"
                >
                  Lead Engineer
                </Badge>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-3">
                Andromeda
              </h3>
              <p className="text-slate-300 leading-relaxed max-w-3xl mb-8">
                A curated Nigerian hospitality and travel platform, built as a
                Turborepo monorepo: six Next.js apps for customers, members,
                hosts, businesses, partners and internal staff, all sharing one
                design system and a typed NestJS API.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  {
                    name: "Storefront",
                    role: "Customer-facing discovery and booking",
                  },
                  {
                    name: "Account",
                    role: "Signed-in member area",
                  },
                  {
                    name: "Host",
                    role: "Vendor portal for bookings and payouts",
                  },
                  {
                    name: "Business",
                    role: "Corporate accounts portal",
                  },
                  {
                    name: "Partners",
                    role: "Partner portal",
                  },
                  {
                    name: "Admin",
                    role: "Staff console with mandatory two-factor auth",
                  },
                  {
                    name: "API",
                    role: "NestJS service with Prisma, PostgreSQL and OpenAPI docs",
                  },
                  {
                    name: "Shared packages",
                    role: "UI kit, auth, data layer, types and config",
                  },
                ].map((workspace) => (
                  <div
                    key={workspace.name}
                    className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4"
                  >
                    <p className="font-semibold text-blue-300 text-sm mb-1">
                      {workspace.name}
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {workspace.role}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Turborepo",
                  "pnpm Workspaces",
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "TanStack Query",
                  "Zod",
                  "NestJS",
                  "Prisma",
                  "PostgreSQL",
                  "Docker",
                  "Playwright",
                  "Vercel",
                  "Render",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="border-slate-600 text-slate-300 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="rounded-lg border border-blue-400/30 bg-blue-400/5 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white mb-1">
                      Source code, live demos and test access are shared on
                      request
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      This project is deployed and working, but the repository
                      and demo access are kept private. Reach out and I'll
                      share the links and a walkthrough.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() =>
                          window.open(
                            "https://wa.me/2349160664513?text=" +
                              encodeURIComponent(
                                "Hi Olusegun, I saw the Andromeda monorepo on your portfolio and I'd like access to the demo and details."
                              ),
                            "_blank"
                          )
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Request on WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                        asChild
                      >
                        <a
                          href={
                            "mailto:segunbanji@gmail.com?subject=" +
                            encodeURIComponent(
                              "Andromeda monorepo access request"
                            )
                          }
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Request by Email
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent"
                        onClick={() => scrollToSection("contact")}
                      >
                        Use the contact form
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "vcc-uat-backend-dev",
                description:
                  "Virtual Call Center API — UAT/staging with OpenAPI docs and conversational AI features",
                tech: "OpenAPI, Conversational AI, REST API",
                demo: "https://vcc-uat-backend-dev.vcc.hexalabs.co/",
                github: "",
                image: "/images/projects/15.png",
              },
              {
                title: "andromedadev-backend",
                description:
                  "API documentation for Andromeda platform backend (developer docs)",
                tech: "API, OpenAPI/Swagger",
                demo: "https://andromedadev-backend.dev.andromeda.mangozestlabs.com/docs",
                github: "",
                image: "/images/projects/14.png",
              },
              {
                title: "poll-systems-backend",
                description: "A Django backend for election polls",
                tech: "Django, PostgreSQL, Docker, REST API",
                demo: "https://www.loom.com/share/9b102d133e0246bb92f5398e12f7cc46?sid=4d234282-df8e-474e-b821-8100932c1ddd",
                github: "https://github.com/Vik2ry/poll-system-backend",
                image: "/images/projects/13.png",
              },
              {
                title: "Scarce2plenty",
                description: "A crowd funding for agricultural goods sales app",
                tech: "React.js, Next.js, Firebase, TailwindCSS",
                demo: "https://scarce2plenty.vercel.app/",
                github: "https://github.com/vik2ry/scarce2plenty-frontend",
                image: "/images/projects/12.png",
              },
              {
                title: "Light Within Her",
                description:
                  "An blog website for healing, therapy and spiritual growth",
                tech: "Next.js, TailwindCSS, Sanity CMS",
                demo: "https://lightwithinher.vercel.app/",
                github: "https://github.com/vik2ry/lightwithinher/",
                image: "/images/projects/11.png",
              },
              {
                title: "Apologist Chatbot Project",
                description: "An AI-powered apologetics chatbot SAS",
                tech: "AI APIs (OpenAI), Next.js, Firebase/Auth",
                demo: "https://apologist.ai/",
                github: "https://github.com/apologist-project/",
                image: "/images/projects/10.png",
              },
              {
                title: "Indigitous Search Engine",
                description: "A Non-copyrighted Search Application",
                tech: "Next.js, TailwindCSS, Custom APIs",
                demo: "https://v0-indigitoussearch.vercel.app/",
                github: "",
                image: "/images/projects/9.png",
              },
              {
                title: "Koinonia Divine Initiative Website",
                description:
                  "An official website for an international Christian NGO",
                tech: "React.js, Next.js, TailwindCSS",
                demo: "https://v0-ngo-site.vercel.app/",
                github: "https://github.com/Vik2ry/kdi",
                image: "/images/projects/8.png",
              },
              {
                title: "Blogging CRUD API Tutorial",
                description: "A Blog CRUD Application",
                tech: "NestJS, TypeScript, REST API",
                demo: "https://nestjs-api-learn.vercel.app/",
                github: "https://github.com/Vik2ry/nestjs-api-learn",
                image: "/images/projects/1.png",
              },
              {
                title: "SpaceX",
                description: "A customized SpaceX landing page from their API",
                tech: "React, SpaceX API, Responsive Design",
                demo: "https://youtu.be/rB2Ornpsnf0",
                github:
                  "https://github.com/Vik2ry/olusegun_banji-frontend-developer",
                image: "/images/projects/6.png",
              },
              {
                title: "Tree of wally",
                description: "A social media popularity monitization API",
                tech: "Node.js, Express, API Development",
                demo: "https://treeofwally.com",
                github: "https://github.com/vik2ry/towally",
                image: "/images/projects/1.png",
              },
              {
                title: "Medium Clone",
                description: "A clone of medium.com",
                tech: "Next.js, Sanity CMS, TailwindCSS",
                demo: "https://sanitymedium4-l.vercel.app/",
                github: "https://github.com/vik2ry/sanitymedium4L",
                image: "/images/projects/5.png",
              },
              {
                title: "Cospire",
                description: "A B2B Space listing and booking startup",
                tech: "React.js, Node.js, Firebase, Google Maps",
                demo: "https://cospire-dev.web.app/",
                github: "https://github.com/frankarinze/cospire",
                image: "/images/projects/4.png",
              },
              {
                title: "WhatsApp Web Clone",
                description: "A clone of WhatsApp web",
                tech: "React, Firebase, Real-time Database",
                demo: "https://whatsappv2-taupe.vercel.app/",
                github: "https://github.com/vik2ry/whatsappv2",
                image: "/images/projects/3.png",
              },
              {
                title: "Growthbot PWA",
                description:
                  "Christian Discipleship Chatbot and Discipler connect App",
                tech: "React, PWA, Chatbot logic",
                demo: "https://whatsapp-v2-dun.vercel.app/",
                github: "https://github.com/vik2ry/whatsapp-v2",
                image: "/images/projects/2.png",
              },
            ].map((project, index) => (
              <Card
                key={index}
                data-project-index={index}
                className={`bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-700 group overflow-hidden transform ${
                  visibleProjects.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: visibleProjects.includes(index)
                    ? `${index * 150}ms`
                    : "0ms",
                }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 mb-3 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <p className="text-slate-400 text-xs mb-4">
                      {project.tech}
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white flex-1 bg-transparent"
                        onClick={() => window.open(project.demo, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      {project.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white flex-1 bg-transparent"
                          onClick={() => window.open(project.github, "_blank")}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section
        id="case-studies"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Case Studies
          </h2>
          <div className="space-y-12 sm:space-y-16">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Virtual Call Center — UAT / Conversational AI
                    </h3>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Problem:</h4>
                        <p>
                          Businesses needed scalable, multilingual customer
                          support with intelligent routing and analytics.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Solution:</h4>
                        <p>
                          Contributed to a Virtual Call Center API with OpenAPI
                          docs, conversational AI, call transcription, and
                          omnichannel support, working as part of the
                          MangoZest Labs team.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Tech Stack:</h4>
                        <p>OpenAPI, REST, Conversational AI, Transcription</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Impact:</h4>
                        <p>
                          Supports automated handling of inbound and outbound
                          customer interactions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/projects/15.png"
                    alt="Virtual Call Center Case Study"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Andromeda Backend — API Docs & JWT Auth
                    </h3>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Problem:</h4>
                        <p>
                          Developers needed clear, secure backend APIs with
                          authentication and health checks.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Solution:</h4>
                        <p>
                          Provided OpenAPI documentation for the Andromeda
                          backend with JWT-based auth and comprehensive
                          endpoint definitions.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Tech Stack:</h4>
                        <p>OpenAPI, JWT Auth, REST API, Health Endpoints</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Impact:</h4>
                        <p>
                          Improved developer onboarding and faster integration
                          using documented endpoints and auth flows.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/projects/14.png"
                    alt="Andromeda Backend Case Study"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Scarce2plenty — Agricultural Crowdfunding Platform
                    </h3>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Problem:
                        </h4>
                        <p>
                          Farmers lacked direct channels to market agricultural
                          goods, facing middlemen costs.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Solution:
                        </h4>
                        <p>
                          Built a crowdfunding/marketplace app enabling direct
                          farmer-to-buyer sales.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Tech Stack:
                        </h4>
                        <p>React.js, Next.js, Firebase, TailwindCSS</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Impact:
                        </h4>
                        <p>
                          Improved farmer visibility; early beta allowed
                          smallholder farmers to test fundraising models.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/projects/12.png"
                    alt="Scarce2plenty Case Study"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Light Within Her — Blog for Healing & Therapy
                    </h3>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Problem:
                        </h4>
                        <p>
                          Many individuals lacked an accessible platform for
                          therapy and spiritual growth resources.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Solution:
                        </h4>
                        <p>
                          Developed a blog site with easy CMS management and
                          responsive layouts.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Tech Stack:
                        </h4>
                        <p>Next.js, Sanity CMS, TailwindCSS</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Impact:
                        </h4>
                        <p>
                          Empowered writers to publish quickly; grew community
                          readership within first months.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/projects/11.png"
                    alt="Light Within Her Case Study"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-blue-400">
                      Poll-systems-backend — Election Polling System
                    </h3>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Problem:
                        </h4>
                        <p>
                          Election systems needed transparent, secure backend
                          APIs.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Solution:
                        </h4>
                        <p>
                          Built Django-based backend with endpoints for polls,
                          votes, and authentication.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Tech Stack:
                        </h4>
                        <p>Django, Python, PostgreSQL, REST Framework</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">
                          Impact:
                        </h4>
                        <p>
                          Enabled demo polling app; Loom walkthrough used in
                          presentations for civic tech.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/images/projects/13.png"
                    alt="Poll Systems Case Study"
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feed Posts Section */}
      <section
        id="feed-posts"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Feed Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Building Scalable React Applications",
                excerpt:
                  "Best practices for structuring large React applications with proper state management and component architecture.",
                date: "Dec 15, 2024",
                readTime: "5 min read",
              },
              {
                title: "NestJS vs Express: A Developer's Perspective",
                excerpt:
                  "Comparing two popular Node.js frameworks and when to choose each for your next project.",
                date: "Dec 10, 2024",
                readTime: "7 min read",
              },
              {
                title: "Firebase vs Supabase: The Database Showdown",
                excerpt:
                  "A comprehensive comparison of two popular Backend-as-a-Service platforms for modern web applications.",
                date: "Dec 5, 2024",
                readTime: "6 min read",
              },
            ].map((post, index) => (
              <Card
                key={index}
                className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Me Section */}
      <section
        id="hire-me"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-blue-400">
            Hire Me
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-12 leading-relaxed px-2">
            I lead engineering work and build products that people can rely on.
            If you have a project, a team or a community that could use that,
            I'd love to hear about it.
          </p>

          {/* WhatsApp-focused call-to-action */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 mb-8 sm:mb-12 border border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Let's Start a Conversation
                </h3>
                <p className="text-slate-300 text-base sm:text-lg">
                  Message me on WhatsApp for quick responses and project
                  discussions
                </p>
              </div>
              <Button
                onClick={() =>
                  window.open("https://wa.me/2349160664513", "_blank")
                }
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message on WhatsApp
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Availability
              </h3>
              <p className="text-slate-300">Open to the right opportunity</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Response Time
              </h3>
              <p className="text-slate-300">Within 24 hours</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Time Zone
              </h3>
              <p className="text-slate-300">WAT (UTC+1)</p>
            </div>
          </div>

          <Button
            onClick={() => scrollToSection("contact")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Or Send a Message Below
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 sm:py-20 relative z-10 px-4 sm:px-6 scroll-animate"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-blue-400">
            Contact
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Ready to bring your ideas to life? I'm available for new
                  projects and collaborations. Let's discuss how we can work
                  together to create something amazing.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">segunbanji@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Jos, Nigeria</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  <a
                    href="https://wa.me/2349160664513"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Message me on WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open("https://github.com/vik2ry", "_blank")
                  }
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/olusegun-banji/",
                      "_blank"
                    )
                  }
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/2349160664513", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Input
                      name="name"
                      placeholder="Olusegun Banji"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      rows={5}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 relative z-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            © 2026 Olusegun Banji. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Return to Top Button */}
      {showReturnToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
