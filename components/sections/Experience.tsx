'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Experience } from '@/lib/sanity/types';

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

export default function Experience({ experiences: sanityExperiences }: ExperienceProps) {
  const experienceList = sanityExperiences && sanityExperiences.length > 0 ? sanityExperiences : fallbackExperiences;

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | undefined, current: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

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

      // Timeline path animation
      const path = timelineRef.current?.querySelector('.timeline-path');
      if (path) {
        gsap.from(path, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
          },
          strokeDashoffset: 1000,
          ease: 'none',
        });
      }

      // Experience cards animation
      const cards = timelineRef.current?.querySelectorAll('.experience-card');
      cards?.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      // Mountain peaks animation
      const peaks = timelineRef.current?.querySelectorAll('.mountain-peak');
      peaks?.forEach((peak) => {
        gsap.from(peak, {
          scrollTrigger: {
            trigger: peak,
            start: 'top 80%',
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            My <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every role has been a stepping stone in my career trek. Here's the path I've traveled,
            with each peak representing a milestone in my professional growth.
          </p>
        </div>

        {/* Mountain Trek Timeline */}
        <div ref={timelineRef} className="relative">
          {/* SVG Path - The Mountain Trail */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            style={{ zIndex: 0 }}
          >
            <path
              className="timeline-path"
              d="M 100 800 Q 200 600, 300 400 T 700 200 T 1100 100"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 5"
              strokeDashoffset="1000"
              opacity="0.3"
            />
          </svg>

          {/* Experience Cards */}
          <div className="relative space-y-16 md:space-y-24">
            {experienceList.map((exp: Experience, index: number) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div
                  key={exp._id}
                  className={`experience-card relative flex flex-col md:flex-row gap-8 items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Mountain Peak Icon */}
                  <div className="mountain-peak relative flex-shrink-0">
                    <div className="relative">
                      {/* Peak circle */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center border-4 border-background shadow-lg shadow-primary/25">
                        {exp.current ? (
                          <svg className="w-8 h-8 text-primary-foreground animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Elevation label */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {formatDate(exp.startDate, false)}
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between flex-col md:flex-row gap-2 mb-2">
                          <div className={isLeft ? '' : 'md:order-2'}>
                            <h3 className="text-xl font-heading font-bold group-hover:text-primary transition-colors">
                              {exp.position}
                            </h3>
                            <p className="text-primary font-medium">{exp.company}</p>
                          </div>
                          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isLeft ? '' : 'md:order-1'}`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {exp.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                          {exp.current && (
                            <span className="ml-2 px-2 py-0.5 bg-accent-green/20 text-accent-green text-xs rounded-full border border-accent-green/30">
                              Current
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Key Responsibilities */}
                      <div className="mb-4">
                        <h4 className="text-sm font-heading font-bold mb-2 text-foreground">
                          Key Responsibilities:
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-background/50 backdrop-blur-sm rounded-full text-xs font-mono border border-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="pt-4 border-t border-primary/10">
                          <h4 className="text-sm font-heading font-bold mb-2 text-accent-green flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Achievements
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {exp.achievements?.map((achievement: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-accent-green mt-1">✓</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trail End - Flag */}
          <div className="mt-20 flex justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center animate-bounce">
                <svg className="w-10 h-10 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-muted-foreground font-medium">
                The journey continues...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
