'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder data - will be replaced with Sanity CMS
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
    color: 'from-accent-blue/20 to-accent-purple/20',
    size: 'large', // Takes 2 columns
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    title: 'Task Manager',
    description: 'Real-time collaboration tool',
    tech: ['React', 'Socket.io', 'Node.js'],
    color: 'from-accent-pink/20 to-accent-purple/20',
    size: 'medium',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Weather App',
    description: 'Beautiful weather forecasting',
    tech: ['React', 'API', 'Tailwind'],
    color: 'from-accent-green/20 to-accent-blue/20',
    size: 'medium',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 4,
    title: 'Portfolio CMS',
    description: 'Content management system',
    tech: ['Sanity', 'Next.js', 'TypeScript'],
    color: 'from-accent-yellow/20 to-accent-green/20',
    size: 'large',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Chat Application',
    description: 'Real-time messaging app',
    tech: ['React', 'Firebase', 'TailwindCSS'],
    color: 'from-accent-purple/20 to-accent-pink/20',
    size: 'medium',
    liveUrl: '#',
    githubUrl: '#',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards stagger animation
      gsap.from(cardsRef.current?.querySelectorAll('.project-card') || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I've built, showcasing my skills in design and development.
            Each project taught me something new and pushed my boundaries.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card group relative overflow-hidden rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] ${
                project.size === 'large' ? 'md:col-span-2' : ''
              } ${index === 0 ? 'lg:row-span-2' : ''}`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
              ></div>

              {/* Content */}
              <div className="relative p-6 h-full flex flex-col justify-between min-h-[280px]">
                <div>
                  {/* Project Title */}
                  <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-xs font-mono border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                  >
                    <svg
                      className="w-4 h-4 group-hover/link:rotate-12 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center justify-center w-10 h-10 bg-card-hover border border-primary/20 hover:border-primary rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="GitHub Repository"
                  >
                    <svg
                      className="w-5 h-5 fill-current group-hover/link:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl pointer-events-none transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/divyavert"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-card hover:bg-card-hover border border-primary/20 hover:border-primary rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View All Projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
