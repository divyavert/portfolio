'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Skill } from '@/lib/sanity/types';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  skills: Skill[];
}

const fallbackSkills = [
  { _id: '1', name: 'React', category: 'frontend', proficiency: 90, order: 1 },
  {
    _id: '2',
    name: 'Next.js',
    category: 'frontend',
    proficiency: 85,
    order: 2,
  },
  {
    _id: '3',
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 88,
    order: 3,
  },
  {
    _id: '4',
    name: 'Tailwind CSS',
    category: 'frontend',
    proficiency: 92,
    order: 4,
  },
  { _id: '5', name: 'Node.js', category: 'backend', proficiency: 80, order: 5 },
  { _id: '6', name: 'Python', category: 'backend', proficiency: 75, order: 6 },
  {
    _id: '7',
    name: 'PostgreSQL',
    category: 'backend',
    proficiency: 72,
    order: 7,
  },
  {
    _id: '8',
    name: 'REST APIs',
    category: 'backend',
    proficiency: 85,
    order: 8,
  },
  { _id: '9', name: 'Git', category: 'tools', proficiency: 88, order: 9 },
  { _id: '10', name: 'Figma', category: 'tools', proficiency: 78, order: 10 },
  { _id: '11', name: 'Docker', category: 'devops', proficiency: 65, order: 11 },
  {
    _id: '12',
    name: 'JavaScript',
    category: 'other',
    proficiency: 90,
    order: 12,
  },
] as Skill[];

// Simple Icons slug mapping — handles names that don't map 1:1
const iconSlugMap: Record<string, string> = {
  // Frameworks & Libraries
  react: 'react',
  'react.js': 'react',
  'next.js': 'nextdotjs',
  'node.js': 'nodedotjs',
  vue: 'vuedotjs',
  'vue.js': 'vuedotjs',
  svelte: 'svelte',
  express: 'express',
  'express.js': 'express',
  fastapi: 'fastapi',
  django: 'django',
  flutter: 'flutter',
  prisma: 'prisma',
  'react query': 'reactquery',
  'framer motion': 'framer',
  framer: 'framer',
  zustand: 'zustand',
  'material ui': 'mui',
  mui: 'mui',

  // Languages
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  go: 'go',
  golang: 'go',
  'go (golang)': 'go',
  'c++': 'cplusplus',
  'c#': 'csharp',
  java: 'java',

  // Styling
  'tailwind css': 'tailwindcss',
  tailwind: 'tailwindcss',
  css: 'css3',
  html: 'html5',
  sass: 'sass',
  scss: 'sass',

  // Databases & Storage
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  mysql: 'mysql',
  redis: 'redis',
  supabase: 'supabase',
  chromadb: 'chromadb',
  firebase: 'firebase',

  // Cloud & DevOps
  aws: 'amazonwebservices',
  vercel: 'vercel',
  docker: 'docker',
  kubernetes: 'kubernetes',
  'github actions': 'githubactions',
  'ci/cd': 'githubactions',

  // Tools & CMS
  git: 'git',
  github: 'github',
  figma: 'figma',
  linux: 'linux',
  vscode: 'visualstudiocode',
  'vs code': 'visualstudiocode',
  sanity: 'sanity',
  'sanity cms': 'sanity',

  // APIs & Protocols
  'rest apis': 'fastapi',
  rest: 'fastapi',
  graphql: 'graphql',
  websocket: 'socketdotio',

  // Concepts - using related/symbolic icons
  'rag / llm integration': 'openai', // AI/LLM related
  'agile/scrum': 'jira', // Agile project management
  agile: 'jira',
  scrum: 'jira',
  'system design': 'diagramsdotnet', // Architecture/diagrams
  'data structures & algorithms': 'leetcode', // Coding/algorithms
  dsa: 'leetcode',
  oop: 'blueprint', // Object-oriented programming
  'object-oriented programming': 'blueprint',
};

function getIconSlug(name: string): string {
  const lower = name.toLowerCase();
  const mapped = iconSlugMap[lower];

  // If explicitly mapped to empty string, return empty (will use fallback)
  if (mapped === '') return '';

  // If mapped, use that
  if (mapped) return mapped;

  // Otherwise, clean the name: remove spaces, dots, parentheses, special chars
  return lower
    .replace(/\s+/g, '')
    .replace(/\./g, 'dot')
    .replace(/[()]/g, '')
    .replace(/[\/&]/g, '');
}

const categoryConfig: Record<
  string,
  {
    label: string;
    accent: string; // CSS var reference
    glow: string; // rgba for box-shadow
    rgb: string; // r,g,b for tint backgrounds
  }
> = {
  languages: {
    label: 'Languages',
    accent: 'hsl(var(--accent-yellow))',
    glow: 'rgba(251,191,36,0.4)',
    rgb: '251,191,36',
  },
  frontend: {
    label: 'Frontend',
    accent: 'hsl(var(--accent-blue))',
    glow: 'rgba(0,227,253,0.4)',
    rgb: '0,227,253',
  },
  backend: {
    label: 'Backend',
    accent: 'hsl(var(--accent-green))',
    glow: 'rgba(52,211,153,0.4)',
    rgb: '52,211,153',
  },
  tools: {
    label: 'Tools',
    accent: 'hsl(var(--primary))',
    glow: 'rgba(255,144,105,0.4)',
    rgb: '255,144,105',
  },
  devops: {
    label: 'DevOps',
    accent: 'hsl(var(--accent-purple))',
    glow: 'rgba(165,140,255,0.4)',
    rgb: '165,140,255',
  },
  concepts: {
    label: 'Concepts',
    accent: 'hsl(var(--tertiary))',
    glow: 'rgba(165,140,255,0.3)',
    rgb: '165,140,255',
  },
  other: {
    label: 'Other',
    accent: 'hsl(var(--muted-foreground))',
    glow: 'rgba(180,180,180,0.2)',
    rgb: '180,180,180',
  },
};

// Bento span pattern — cycles through sizes to create visual rhythm
// 'wide' = col-span-2, 'tall' = row-span-2, 'big' = col+row span 2, 'normal' = 1x1
type CardSize = 'wide' | 'tall' | 'big' | 'normal';
// Pattern designed for 6-column grid to avoid gaps

const featuredSkillSizes: Record<string, CardSize> = {
  javascript: 'wide',
  react: 'wide',
  'react.js': 'wide',
  express: 'wide',
  'express.js': 'wide',
};

function SkillCard({
  skill,
  size,
  index,
}: {
  skill: Skill;
  size: CardSize;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cat = categoryConfig[skill.category] ?? categoryConfig.other;
  const slug = getIconSlug(skill.name);

  // Only try to load icon if slug exists
  const coloredIconUrl = slug ? `https://cdn.simpleicons.org/${slug}` : '';
  const whiteIconUrl = slug ? `https://cdn.simpleicons.org/${slug}/ffffff` : '';
  const [loadedIconUrl, setLoadedIconUrl] = useState('');

  const isWide = size === 'wide' || size === 'big';
  const isTall = size === 'tall' || size === 'big';

  // Floating animation offset — each card floats at slightly different rhythm
  const floatDelay = (index * 0.2) % 2;
  const floatDuration = 3 + (index % 3) * 0.5; // 3s to 4.5s

  useEffect(() => {
    if (!cardRef.current) return;

    // Gentle floating animation
    gsap.to(cardRef.current, {
      y: '+=8',
      duration: floatDuration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: floatDelay,
    });
  }, [floatDelay, floatDuration]);

  useEffect(() => {
    let isCancelled = false;

    if (!coloredIconUrl) {
      setLoadedIconUrl('');
      return;
    }

    setLoadedIconUrl('');

    const tryLoadIcon = (src: string) =>
      new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
      });

    const loadIcon = async () => {
      try {
        const nextIcon = await tryLoadIcon(coloredIconUrl);
        if (!isCancelled) {
          setLoadedIconUrl(nextIcon);
        }
      } catch {
        if (!whiteIconUrl) {
          return;
        }

        try {
          const nextIcon = await tryLoadIcon(whiteIconUrl);
          if (!isCancelled) {
            setLoadedIconUrl(nextIcon);
          }
        } catch {
          if (!isCancelled) {
            setLoadedIconUrl('');
          }
        }
      }
    };

    loadIcon();

    return () => {
      isCancelled = true;
    };
  }, [coloredIconUrl, whiteIconUrl]);

  const shouldShowIcon = Boolean(loadedIconUrl);

  return (
    <div
      ref={cardRef}
      className='skill-card gsap-hidden group relative overflow-hidden rounded-xl cursor-default select-none'
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        gridRow: isTall ? 'span 2' : 'span 1',
        background: `radial-gradient(ellipse at top left, rgba(${cat.rgb}, 0.08) 0%, hsl(var(--surface-container)) 50%)`,
        border: `1px solid rgba(${cat.rgb}, 0.15)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 4px rgba(0,0,0,0.15)`,
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 3D tilt effect
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.03)`;
        el.style.boxShadow = `
          0 4px 16px rgba(0,0,0,0.3),
          0 0 0 1px rgba(${cat.rgb},0.3),
          inset 0 1px 0 rgba(255,255,255,0.05)
        `;
        el.style.borderColor = `rgba(${cat.rgb}, 0.4)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        el.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 4px rgba(0,0,0,0.15)`;
        el.style.borderColor = `rgba(${cat.rgb}, 0.15)`;
      }}
    >
      {/* Radial gradient overlay for depth - subtle */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(${cat.rgb},0.08) 0%, transparent 60%)`,
          opacity: 0.3,
        }}
      />

      {/* Animated gradient sphere on hover - subtle */}
      <div
        className='pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-700'
        style={{
          background: `radial-gradient(circle, rgba(${cat.rgb},0.2) 0%, transparent 70%)`,
        }}
      />

      {/* Card content */}
      <div
        className={`relative z-10 flex h-full w-full ${isTall ? 'flex-col items-center justify-center gap-5 p-6' : 'flex-col items-center justify-center gap-3 p-5'}`}
      >
        {/* Logo container - minimal */}
        <div className='relative'>
          {/* Logo or fallback */}
          <div
            className={`relative flex items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-105 ${
              isTall ? 'w-16 h-16' : isWide ? 'w-12 h-12' : 'w-11 h-11'
            }`}
            style={{
              background: `linear-gradient(135deg, rgba(${cat.rgb}, 0.12), rgba(${cat.rgb}, 0.04))`,
              boxShadow: `inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 6px rgba(${cat.rgb}, 0.15)`,
            }}
          >
            {shouldShowIcon ? (
              <img
                src={loadedIconUrl}
                alt={skill.name}
                className={`${isTall ? 'w-9 h-9' : 'w-7 h-7'} transition-all duration-300 group-hover:scale-105`}
                style={{
                  objectFit: 'contain',
                  filter: loadedIconUrl.includes('/ffffff')
                    ? 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(255,255,255,0.1))'
                    : 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))',
                }}
              />
            ) : (
              <span
                className={`font-display font-bold ${isTall ? 'text-2xl' : 'text-lg'}`}
                style={{
                  color: cat.accent,
                  textShadow: `0 0 6px ${cat.glow}`,
                }}
              >
                {skill.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className='text-center'>
          <p
            className={`font-body font-bold leading-tight transition-all duration-300 group-hover:text-white group-hover:scale-105 ${
              isTall ? 'text-base' : isWide ? 'text-sm' : 'text-xs'
            }`}
            style={{
              color: 'hsl(var(--foreground) / 0.85)',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {skill.name}
          </p>

          {/* Category tag — only on big/tall cards */}
          {isTall && (
            <p
              className='text-[10px] font-label uppercase tracking-[0.25em] mt-2 opacity-70 group-hover:opacity-100 transition-opacity'
              style={{
                color: cat.accent,
                textShadow: `0 0 4px ${cat.glow}`,
              }}
            >
              {cat.label}
            </p>
          )}
        </div>
      </div>

      {/* Shine effect overlay */}
      <div
        className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{
          background:
            'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}

export default function Skills({ skills: sanitySkills }: SkillsProps) {
  const skillList =
    sanitySkills && sanitySkills.length > 0 ? sanitySkills : fallbackSkills;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Normalize category + sort by order
  const normalizedSkills = skillList
    .map((s) => ({
      ...s,
      category: categoryConfig[s.category] ? s.category : 'other',
    }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const totalSkills = normalizedSkills.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header lines
      gsap.fromTo(
        headerRef.current?.querySelectorAll('.h-line') ?? [],
        { y: 70, autoAlpha: 0 },
        {
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%' },
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
        },
      );

      // Bento cards pop in
      gsap.fromTo(
        '.skill-card',
        { scale: 0.85, autoAlpha: 0, y: 20 },
        {
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: { amount: 0.7, from: 'start' },
          ease: 'back.out(1.4)',
          immediateRender: false,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='skills'
      ref={sectionRef}
      className='relative px-4 py-24 bg-surface-container-low overflow-hidden'
    >
      {/* Noise texture */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Ambient glows - subtle */}
      <div
        className='pointer-events-none absolute top-0 right-0 w-[600px] h-[500px] opacity-[0.03]'
        style={{
          background:
            'radial-gradient(ellipse at 80% 10%, hsl(var(--accent-blue)) 0%, transparent 65%)',
        }}
      />
      <div
        className='pointer-events-none absolute bottom-0 left-0 w-[500px] h-[400px] opacity-[0.03]'
        style={{
          background:
            'radial-gradient(ellipse at 20% 90%, hsl(var(--primary)) 0%, transparent 65%)',
        }}
      />

      <div className='container mx-auto max-w-6xl relative z-10'>
        {/* ── Header ── */}
        <div ref={headerRef} className='mb-14'>
          <div className='h-line gsap-hidden flex items-center gap-3 mb-5'>
            <div
              className='h-px w-12'
              style={{ background: 'hsl(var(--primary))' }}
            />
            <span
              className='font-label text-[10px] tracking-[0.35em] uppercase font-bold'
              style={{ color: 'hsl(var(--primary))' }}
            >
              {totalSkills} technologies
            </span>
          </div>

          <h2 className='font-display font-bold leading-[0.9] mb-4'>
            <span
              className='h-line gsap-hidden block text-[clamp(3.5rem,10vw,7rem)]'
              style={{ color: 'hsl(var(--foreground))' }}
            >
              Technical
            </span>
            <span
              className='h-line gsap-hidden block text-[clamp(3.5rem,10vw,7rem)] italic'
              style={{
                WebkitTextStroke: '1.5px hsl(var(--primary))',
                color: 'transparent',
              }}
            >
              Arsenal
            </span>
          </h2>

          <p
            className='h-line gsap-hidden font-body text-sm max-w-sm leading-relaxed'
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            The stack I reach for — languages, frameworks, tools, and concepts
            I&apos;ve shipped real things with.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div
          ref={gridRef}
          className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'
          style={{
            gridAutoRows: '130px',
            gridAutoFlow: 'dense',
          }}
        >
          {normalizedSkills.map((skill, i) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              size={featuredSkillSizes[skill.name.toLowerCase()] || 'normal'}
              index={i}
            />
          ))}
        </div>

        {/* ── Footer rule ── */}
        <div className='mt-16 flex items-center gap-16'>
          <div
            className='h-px flex-1 opacity-10'
            style={{ background: 'hsl(var(--foreground))' }}
          />
          <span
            className='font-label text-[9px] tracking-[0.3em] uppercase opacity-30'
            style={{ color: 'hsl(var(--foreground))' }}
          >
            skills &amp; expertise
          </span>
          <div
            className='h-px flex-1 opacity-10'
            style={{ background: 'hsl(var(--foreground))' }}
          />
        </div>
      </div>
    </section>
  );
}
