'use client';

import { useEffect, useRef, useState } from 'react';
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

const categoryConfig: Record<
  string,
  {
    label: string;
    accentClass: string;
    surfaceClass: string;
  }
> = {
  fullstack: { label: 'Full-Stack', accentClass: 'text-primary', surfaceClass: 'border-primary/20 bg-primary/10' },
  frontend: { label: 'Frontend', accentClass: 'text-accent-blue', surfaceClass: 'border-accent-blue/20 bg-accent-blue/10' },
  backend: { label: 'Backend', accentClass: 'text-accent-green', surfaceClass: 'border-accent-green/20 bg-accent-green/10' },
  ai: { label: 'AI / ML', accentClass: 'text-accent-purple', surfaceClass: 'border-accent-purple/20 bg-accent-purple/10' },
  tools: { label: 'Tools', accentClass: 'text-accent-yellow', surfaceClass: 'border-accent-yellow/20 bg-accent-yellow/10' },
};

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-3 last:mb-0">{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="rounded bg-surface-container-high px-1 py-0.5 text-xs">{children}</code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors hover:text-primary"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
    number: ({ children }: any) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-sm">{children}</li>,
    number: ({ children }: any) => <li className="text-sm">{children}</li>,
  },
};

const fallbackProjects: Project[] = [
  {
    _id: '1',
    title: 'Jira Flow',
    slug: { current: 'jira-flow' },
    shortDescription: 'Project management dashboard adopted by ~37 engineers.',
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
    shortDescription: 'AI-powered chatbot using RAG for intelligent document search.',
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
    shortDescription: 'Portfolio site with GSAP motion, Sanity CMS, and custom UI systems.',
    technologies: ['Next.js', 'TypeScript', 'GSAP', 'Sanity'],
    category: 'frontend',
    liveUrl: 'https://divyavert.com',
    githubUrl: 'https://github.com/divyavert/portfolio',
    featured: true,
    order: 3,
  },
];

function getProjectImage(project: Project, index: number) {
  if (project.thumbnail) {
    return urlFor(project.thumbnail).width(1200).height(900).url();
  }

  return `https://images.unsplash.com/photo-${
    index === 0
      ? '1460925895917-afdab827c52f'
      : index === 1
        ? '1555421689-491a97ff2040'
        : '1517694712202-14dd9538aa97'
  }?w=1200&h=900&fit=crop&q=80`;
}

function ProjectActions({ project, compact = false }: { project: Project; compact?: boolean }) {
  const liveClasses = compact
    ? 'inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-label font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/15'
    : 'inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-label font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/15';

  const codeClasses = compact
    ? 'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface-container-high px-3 py-1.5 text-[11px] font-label font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-white/5'
    : 'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface-container-high px-4 py-2 text-sm font-label font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-white/5';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={liveClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Live
        </a>
      ) : null}

      {project.githubUrl ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={codeClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Code
        </a>
      ) : null}
    </div>
  );
}

function ProjectDialog({
  project,
  index,
  onClose,
}: {
  project: Project;
  index: number;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const category = categoryConfig[project.category || 'fullstack'] ?? categoryConfig.fullstack;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className={`fixed left-1/2 top-1/2 z-50 flex w-full max-w-lg -translate-x-1/2 flex-col overflow-y-auto rounded-2xl bg-surface-container border border-white/10 shadow-2xl transition-all duration-300 ease-out max-h-[90vh] ${isOpen ? '-translate-y-1/2 opacity-100 scale-100' : '-translate-y-[45%] opacity-0 scale-95'}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full shrink-0 bg-surface-container-high">
          <Image
            src={getProjectImage(project, index)}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
            priority
          />
          {/* Close button overlaid on image */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Badge row */}
          <div className="flex items-center justify-between gap-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.22em] ${category.accentClass} ${category.surfaceClass}`}
            >
              {category.label}
            </span>
            {project.status ? (
              <span className="text-[10px] font-label uppercase tracking-[0.2em] text-muted-foreground">
                {project.status.replace('-', ' ')}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold leading-tight text-foreground">
            {project.title}
          </h2>

          {/* Description */}
          <div className="text-sm leading-7 text-muted-foreground">
            {project.description ? (
              <PortableText value={project.description} components={portableTextComponents} />
            ) : (
              <p>{project.shortDescription}</p>
            )}
          </div>

          {/* All technologies */}
          {project.technologies?.length ? (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-label font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-surface-container-high px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <ProjectActions project={project} />
        </div>
      </div>
    </>
  );
}

export default function Projects({ projects: sanityProjects }: ProjectsProps) {
  const projectList = sanityProjects && sanityProjects.length > 0 ? sanityProjects : fallbackProjects;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<{ project: Project; index: number } | null>(null);

  const sortedProjects = [...projectList].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, autoAlpha: 0 },
        {
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%' },
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        },
      );

      gsap.fromTo(
        gridRef.current?.querySelectorAll('.project-card') || [],
        { y: 48, autoAlpha: 0 },
        {
          scrollTrigger: { trigger: gridRef.current, start: 'top 78%' },
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="projects" ref={sectionRef} className="px-4 py-24 bg-surface-container-low">
        <div className="container mx-auto max-w-6xl">
          <div ref={headerRef} className="mb-12 gsap-hidden">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-2">
              Featured <span className="italic text-primary">Projects</span>
            </h2>
            <p className="text-primary text-xs tracking-widest font-label font-bold uppercase">
              SELECTED WORKS // CREATIVE ENGINEERING
            </p>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project, index) => {
              const category = categoryConfig[project.category || 'fullstack'] ?? categoryConfig.fullstack;

              return (
                <article
                  key={project._id}
                  onClick={() => setSelectedProject({ project, index })}
                  className="project-card gsap-hidden group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-surface-container shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition-all duration-200 hover:bg-surface-container-high hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex flex-col gap-4 p-5">
                    {/* Badge row */}
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.22em] ${category.accentClass} ${category.surfaceClass}`}
                      >
                        {category.label}
                      </span>
                      {project.status ? (
                        <span className="text-[10px] font-label uppercase tracking-[0.2em] text-muted-foreground">
                          {project.status.replace('-', ' ')}
                        </span>
                      ) : null}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-sm leading-6 text-muted-foreground line-clamp-3">
                      {project.shortDescription ?? ''}
                    </p>

                    {/* Tech badges */}
                    {project.technologies?.length ? (
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-surface-container-high px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 ? (
                          <span className="rounded-full border border-white/10 bg-surface-container-high px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            +{project.technologies.length - 3}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Click hint */}
                    <div className="flex items-center gap-1 text-[10px] font-label uppercase tracking-[0.2em] text-muted-foreground/50 group-hover:text-primary/60 transition-colors duration-200">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      View details
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedProject ? (
        <ProjectDialog
          project={selectedProject.project}
          index={selectedProject.index}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </>
  );
}
