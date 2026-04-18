'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Experience } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceProps {
  experiences: Experience[];
}

// Fallback data
const fallbackExperiences: Experience[] = [
  {
    _id: '1',
    company: 'Tech Company',
    position: 'Software Engineer',
    location: 'Remote',
    startDate: '2024-01-01',
    endDate: undefined,
    current: true,
    description: 'Building modern web applications',
    responsibilities: ['Developed React applications', 'Led team initiatives'],
    technologies: ['React', 'Next.js', 'TypeScript'],
    achievements: ['Improved performance by 40%'],
  },
];

// Pattern configurations for editorial layout
const cardWidthPattern = ['75%', '60%', '70%', '65%'];
const cardOffsetPattern = ['0', 'auto 0 0 auto', '0 0', 'auto'];

export default function Experience({
  experiences: sanityExperiences,
}: ExperienceProps) {
  const experienceList =
    sanityExperiences && sanityExperiences.length > 0
      ? sanityExperiences
      : fallbackExperiences;

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | undefined, current: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getYear = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 50, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
        }
      );

      // Trail path animation - draw in
      gsap.fromTo('.trail-path',
        { strokeDashoffset: 1000, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
          },
          strokeDashoffset: 0,
          autoAlpha: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: 'power2.out',
          immediateRender: false,
        }
      );

      // Experience cards - staggered cascade
      gsap.fromTo('.experience-card',
        { y: 80, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
          },
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          immediateRender: false,
        }
      );

      // Year markers - fade and scale
      gsap.fromTo('.year-marker',
        { scale: 0.8, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
          },
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          immediateRender: false,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='experience'
      ref={sectionRef}
      className='min-h-screen px-4 py-20 bg-background relative overflow-hidden'
    >
      {/* Section Header */}
      <div ref={titleRef} className='container mx-auto max-w-6xl mb-16 gsap-hidden'>
        <h2 className='text-6xl md:text-8xl font-display font-bold mb-2'>
          Work <span className='italic text-primary'>Experience</span>
        </h2>
        <p className='text-primary text-xs tracking-widest font-label font-bold uppercase'>
          CAREER JOURNEY // PROFESSIONAL HIGHLIGHTS
        </p>
      </div>

      {/* Experience Timeline Container */}
      <div ref={timelineRef} className='container mx-auto max-w-6xl relative'>
        {/* Connecting Trail Path */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" 
          style={{ zIndex: 0 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(255, 144, 105)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="rgb(255, 144, 105)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(255, 144, 105)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Generate connecting lines between cards */}
          {experienceList.map((exp, index) => {
            if (index === experienceList.length - 1) return null; // Skip last card
            
            const currentSide = index % 2 === 0 ? 'left' : 'right';
            const nextSide = (index + 1) % 2 === 0 ? 'left' : 'right';
            
            // Calculate approximate positions based on card pattern
            const cardHeightEstimate = 400; // Approximate card height
            const gapBetweenCards = index < experienceList.length - 1 ? 128 : 0; // mb-32 = 128px
            const currentY = index * (cardHeightEstimate + gapBetweenCards) + (cardHeightEstimate / 2);
            const nextY = (index + 1) * (cardHeightEstimate + gapBetweenCards) + (cardHeightEstimate / 2);
            
            // X positions based on card width patterns
            const currentWidth = parseInt(cardWidthPattern[index % cardWidthPattern.length]);
            const nextWidth = parseInt(cardWidthPattern[(index + 1) % cardWidthPattern.length]);
            
            let currentX, nextX;
            
            // Calculate X based on margin pattern
            if (currentSide === 'left') {
              currentX = currentWidth;
            } else {
              currentX = 100 - currentWidth;
            }
            
            if (nextSide === 'left') {
              nextX = nextWidth;
            } else {
              nextX = 100 - nextWidth;
            }
            
            // Create curved path
            const controlPointY = currentY + (nextY - currentY) / 2;
            
            return (
              <path
                key={`path-${index}`}
                d={`M ${currentX}% ${currentY} Q ${currentX}% ${controlPointY}, ${nextX}% ${nextY}`}
                stroke="url(#pathGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8 8"
                opacity="0.6"
                className="trail-path"
              />
            );
          })}
        </svg>

        {experienceList.map((exp: Experience, index: number) => {
          const isCurrentRole = exp.current;
          const cardWidth = cardWidthPattern[index % cardWidthPattern.length];
          const cardMargin =
            cardOffsetPattern[index % cardOffsetPattern.length];
          const yearSide = index % 2 === 0 ? 'left' : 'right';
          const year = getYear(exp.startDate);

          return (
            <div key={exp._id} className='relative mb-20 md:mb-16'>
              {/* Year Marker - Side Margins (Desktop only) */}
              {year && (
                <>
                  {/* Left side year */}
                  {yearSide === 'left' && (
                    <div className='year-marker gsap-hidden hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 xl:-translate-x-32'>
                      <span className='text-6xl xl:text-7xl font-display font-bold text-foreground/30 -rotate-90 origin-center inline-block whitespace-nowrap'>
                        {year}
                      </span>
                    </div>
                  )}

                  {/* Right side year */}
                  {yearSide === 'right' && (
                    <div className='year-marker gsap-hidden hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-24 xl:translate-x-32'>
                      <span className='text-6xl xl:text-7xl font-display font-bold text-foreground/30 rotate-90 origin-center inline-block whitespace-nowrap'>
                        {year}
                      </span>
                    </div>
                  )}

                  {/* Mobile year - horizontal at top */}
                  <div className='lg:hidden mb-4 gsap-hidden year-marker'>
                    <span className='text-3xl font-display font-bold text-foreground/30'>
                      {year}
                    </span>
                  </div>
                </>
              )}

              {/* Experience Card */}
              <div
                className='experience-card gsap-hidden relative'
                style={{
                  width: '100%',
                  maxWidth: cardWidth,
                  margin: cardMargin,
                  zIndex: 10,
                }}
              >
                {isCurrentRole ? (
                  // Current Role Card - Minimal with subtle accent
                  <div className='relative rounded-2xl p-6 md:p-8 bg-surface-container-high border border-border/20 hover:border-primary/40 transition-all duration-500 group'>
                    {/* Content */}
                    <div className='relative z-10'>
                      {/* Header */}
                      <div className='mb-4'>
                        <div className='flex items-start justify-between flex-col md:flex-row gap-3 mb-3'>
                          <div className='flex items-start gap-3'>
                            {/* Company Logo */}
                            {exp.companyLogo && (
                              <div className='flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidde border border-border/20 p-1.5'>
                                <Image
                                  src={urlFor(exp.companyLogo)
                                    .width(80)
                                    .height(80)
                                    .url()}
                                  alt={`${exp.company} logo`}
                                  width={80}
                                  height={80}
                                  className='w-full h-full object-contain'
                                />
                              </div>
                            )}
                            <div>
                              <h3 className='text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight'>
                                {exp.position}
                              </h3>
                              <p className='text-lg md:text-xl font-body font-medium text-muted-foreground'>
                                {exp.company}
                              </p>
                            </div>
                          </div>

                          {/* Current Badge - minimal */}
                          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20'>
                            <div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                            <span className='text-xs font-label uppercase tracking-wider text-primary font-medium'>
                              Current
                            </span>
                          </div>
                        </div>

                        {/* Location & Date */}
                        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70 font-body'>
                          {exp.location && (
                            <div className='flex items-center gap-2'>
                              <svg
                                className='w-4 h-4'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                  clipRule='evenodd'
                                />
                              </svg>
                              {exp.location}
                            </div>
                          )}
                          <div className='flex items-center gap-2'>
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='font-label text-xs tracking-wider'>
                              {formatDate(exp.startDate, false)} -{' '}
                              {formatDate(exp.endDate, exp.current)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className='text-muted-foreground font-body mb-4 leading-relaxed whitespace-pre-line'>
                        {exp.description}
                      </p>

                      {/* Technologies - Simple text list */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className='mb-4'>
                          <div className='flex flex-wrap gap-2'>
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className='px-2.5 py-1 rounded bg-surface-container text-muted-foreground/80 text-xs font-label uppercase tracking-wide'
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className='pt-4 border-t border-border/10'>
                          <h4 className='text-xs font-label font-bold uppercase tracking-wider mb-3 text-muted-foreground/60'>
                            Key Achievements
                          </h4>
                          <ul className='space-y-2'>
                            {exp.achievements.map(
                              (achievement: string, idx: number) => (
                                <li
                                  key={idx}
                                  className='flex items-start gap-3'
                                >
                                  <span className='text-primary mt-0.5 text-sm'>
                                    →
                                  </span>
                                  <span className='text-sm text-muted-foreground font-body leading-relaxed'>
                                    {achievement}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Past Role Card - Even more minimal
                  <div className='relative rounded-2xl p-6 bg-surface-container border border-border/10 hover:border-border/20 transition-all duration-500 group'>
                    {/* Content */}
                    <div className='relative z-10'>
                      {/* Header */}
                      <div className='mb-4'>
                        <div className='flex items-start justify-between flex-col md:flex-row gap-3 mb-3'>
                          <div className='flex items-start gap-3'>
                            {/* Company Logo */}
                            {exp.companyLogo && (
                              <div className='flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-white/5 border border-border/20 p-1.5'>
                                <Image
                                  src={urlFor(exp.companyLogo)
                                    .width(80)
                                    .height(80)
                                    .url()}
                                  alt={`${exp.company} logo`}
                                  width={80}
                                  height={80}
                                  className='w-full h-full object-contain'
                                />
                              </div>
                            )}
                            <div>
                              <h3 className='text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight'>
                                {exp.position}
                              </h3>
                              <p className='text-lg md:text-xl font-body font-medium text-muted-foreground'>
                                {exp.company}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Location & Date */}
                        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground/60 font-body'>
                          {exp.location && (
                            <div className='flex items-center gap-2'>
                              <svg
                                className='w-4 h-4'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                  clipRule='evenodd'
                                />
                              </svg>
                              {exp.location}
                            </div>
                          )}
                          <div className='flex items-center gap-2'>
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='font-label text-xs tracking-wider'>
                              {formatDate(exp.startDate, false)} -{' '}
                              {formatDate(exp.endDate, exp.current)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className='text-muted-foreground/80 font-body mb-4 leading-relaxed whitespace-pre-line'>
                        {exp.description}
                      </p>

                      {/* Technologies - Simple text list */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className='mb-4'>
                          <div className='flex flex-wrap gap-2'>
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className='px-2.5 py-1 rounded bg-surface-base text-muted-foreground/70 text-xs font-label uppercase tracking-wide'
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className='pt-4 border-t border-border/10'>
                          <h4 className='text-xs font-label font-bold uppercase tracking-wider mb-3 text-muted-foreground/50'>
                            Key Achievements
                          </h4>
                          <ul className='space-y-2'>
                            {exp.achievements.map(
                              (achievement: string, idx: number) => (
                                <li
                                  key={idx}
                                  className='flex items-start gap-3'
                                >
                                  <span className='text-muted-foreground/40 mt-0.5 text-sm'>
                                    →
                                  </span>
                                  <span className='text-sm text-muted-foreground/70 font-body leading-relaxed'>
                                    {achievement}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Section Footer */}
        <div className='mt-20 text-center'>
          <div className='inline-flex items-center gap-3 text-muted-foreground font-body'>
            <div className='h-px w-12 bg-border' />
            <span className='text-sm'>The journey continues...</span>
            <div className='h-px w-12 bg-border' />
          </div>
        </div>
      </div>
    </section>
  );
}
