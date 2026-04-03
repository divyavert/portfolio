'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/image';
import type { Project } from '@/lib/sanity/types';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  projects: Project[];
}

// Category configuration matching Projects section design
const categoryConfig: Record<string, {
  label: string;
  accent: string;
  rgb: string;
}> = {
  fullstack: { label: 'Full-Stack',  accent: 'hsl(var(--primary))',       rgb: '255,144,105' },
  frontend:  { label: 'Frontend',    accent: 'hsl(var(--accent-blue))',   rgb: '0,227,253'   },
  backend:   { label: 'Backend',     accent: 'hsl(var(--accent-green))',  rgb: '52,211,153'  },
  ai:        { label: 'AI/ML',       accent: 'hsl(var(--accent-purple))', rgb: '165,140,255' },
  tools:     { label: 'Tools',       accent: 'hsl(var(--accent-yellow))', rgb: '251,191,36'  },
};

// Custom PortableText components for rich text rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
    h3: ({ children }: any) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-sm font-semibold mb-1">{children}</h4>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => <code className="px-1 py-0.5 rounded bg-surface-container-high text-xs">{children}</code>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-sm">{children}</li>,
    number: ({ children }: any) => <li className="text-sm">{children}</li>,
  },
};

// Fallback data
const fallbackProjects: Project[] = [
  {
    _id: '1',
    title: 'Jira Flow',
    slug: { current: 'jira-flow' },
    shortDescription: 'Project Management Dashboard adopted by ~37 engineers',
    technologies: ['Next.js', 'Jira API', 'React', 'TypeScript'],
    category: 'fullstack',
    githubUrl: 'https://github.com/divyavert/jira-flow',
    featured: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'Confluence RAG Chatbot',
    slug: { current: 'confluence-rag' },
    shortDescription: 'AI-powered chatbot using RAG for intelligent document search',
    technologies: ['Python', 'FastAPI', 'ChromaDB', 'OpenAI'],
    category: 'ai',
    githubUrl: 'https://github.com/divyavert/confluence-rag',
    featured: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'Modern Portfolio Website',
    slug: { current: 'portfolio' },
    shortDescription: 'Sleek animated portfolio with GSAP and neon editorial design',
    technologies: ['Next.js', 'TypeScript', 'GSAP', 'Sanity'],
    category: 'frontend',
    liveUrl: 'https://divyavert.com',
    githubUrl: 'https://github.com/divyavert/portfolio',
    featured: true,
    order: 3,
  },
];

export default function Projects({ projects: sanityProjects }: ProjectsProps) {
  const projectList = sanityProjects && sanityProjects.length > 0 ? sanityProjects : fallbackProjects;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current?.querySelectorAll('.project-card') || [],
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 70%',
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          immediateRender: false,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative px-4 py-24 bg-surface-container-low overflow-hidden"
    >
      {/* Background effects */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-12">
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-2">
            Featured <span className="italic text-primary">Projects</span>
          </h2>
          <p className="text-primary text-xs tracking-widest font-label font-bold uppercase">
            SELECTED WORKS // CREATIVE ENGINEERING
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projectList.map((project, index: number) => {
            const cat = categoryConfig[project.category || 'fullstack'] ?? categoryConfig.fullstack;
            
            // Use thumbnail from Sanity, fallback to Unsplash placeholder
            const projectImage = project.thumbnail 
              ? urlFor(project.thumbnail).width(800).height(450).url() 
              : `https://images.unsplash.com/photo-${
                  index === 0 ? '1460925895917-afdab827c52f' : // Code/Development
                  index === 1 ? '1555421689-491a97ff2040' : // AI/Tech
                  '1517694712202-14dd9538aa97' // Modern tech
                }?w=800&h=450&fit=crop&q=80`;
            
            return (
              <div
                key={project._id}
                className="project-card group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col"
                style={{
                  background: 'hsl(var(--surface-container))',
                  border: `1px solid rgba(${cat.rgb}, 0.2)`,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
                }}
              >
                {/* Image Section - 4:3 aspect ratio, top of card */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container-high flex-shrink-0">
                  <Image 
                    src={projectImage} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300"
                    priority={index < 3}
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  {/* Category Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-label uppercase tracking-[0.2em] font-bold"
                      style={{
                        background: `rgba(${cat.rgb}, 0.1)`,
                        color: cat.accent,
                        border: `1px solid rgba(${cat.rgb}, 0.25)`,
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display font-bold leading-tight flex-shrink-0" style={{ color: 'hsl(var(--foreground))' }}>
                    {project.title}
                  </h3>

                  {/* Description - Full text with overflow ellipsis */}
                  <div 
                    className="text-sm font-body leading-relaxed flex-1 overflow-hidden"
                    style={{ 
                      color: 'hsl(var(--muted-foreground))',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {project.description ? (
                      <PortableText value={project.description} components={portableTextComponents} />
                    ) : (
                      project.shortDescription
                    )}
                  </div>

                  {/* Tech Stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-label uppercase tracking-wider font-medium"
                          style={{
                            background: `rgba(${cat.rgb}, 0.08)`,
                            color: 'hsl(var(--foreground) / 0.7)',
                            border: `1px solid rgba(${cat.rgb}, 0.15)`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span
                          className="px-2.5 py-1 rounded-lg text-[10px] font-label uppercase tracking-wider font-medium"
                          style={{
                            background: `rgba(${cat.rgb}, 0.08)`,
                            color: 'hsl(var(--foreground) / 0.5)',
                            border: `1px solid rgba(${cat.rgb}, 0.15)`,
                          }}
                        >
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-semibold text-xs transition-all duration-300 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, rgba(${cat.rgb}, 0.9), rgba(${cat.rgb}, 0.7))`,
                          color: 'hsl(var(--background))',
                          boxShadow: `0 2px 6px rgba(0,0,0,0.2)`,
                        }}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: `rgba(${cat.rgb}, 0.1)`,
                          border: `1px solid rgba(${cat.rgb}, 0.2)`,
                          color: cat.accent,
                        }}
                        aria-label="GitHub Repository"
                      >
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover lift effect */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 8px 24px rgba(${cat.rgb}, 0.15), 0 0 0 1px rgba(${cat.rgb}, 0.3)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/divyavert"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-container hover:bg-surface-container-high rounded-full font-body font-medium transition-all duration-300 hover:scale-105"
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
