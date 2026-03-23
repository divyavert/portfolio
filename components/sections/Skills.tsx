'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Skill } from '@/lib/sanity/types';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  skills: Skill[];
}

// Fallback data
const fallbackSkills: Skill[] = [
  { _id: '1', name: 'React', category: 'frontend', proficiency: 90, order: 1 },
  { _id: '2', name: 'Next.js', category: 'frontend', proficiency: 85, order: 2 },
  { _id: '3', name: 'TypeScript', category: 'frontend', proficiency: 88, order: 3 },
  { _id: '4', name: 'Node.js', category: 'backend', proficiency: 80, order: 4 },
  { _id: '5', name: 'Python', category: 'backend', proficiency: 75, order: 5 },
  { _id: '6', name: 'Git', category: 'tools', proficiency: 88, order: 6 },
  { _id: '7', name: 'Docker', category: 'devops', proficiency: 65, order: 7 },
];

const categories = {
  frontend: { name: 'Frontend', color: 'text-accent-blue' },
  backend: { name: 'Backend', color: 'text-accent-green' },
  devops: { name: 'DevOps', color: 'text-accent-purple' },
  tools: { name: 'Tools', color: 'text-primary' },
  other: { name: 'Other', color: 'text-muted-foreground' },
};

// Color gradient mappings for skill badges
const colorGradients: Record<string, string> = {
  frontend: 'from-accent-blue/30 to-accent-blue/10',
  backend: 'from-accent-green/30 to-accent-green/10',
  devops: 'from-accent-purple/30 to-accent-purple/10',
  tools: 'from-primary/30 to-primary/10',
  other: 'from-muted/30 to-muted/10',
};

export default function Skills({ skills: sanitySkills }: SkillsProps) {
  const skillList = sanitySkills && sanitySkills.length > 0 ? sanitySkills : fallbackSkills;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);

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

      // Skills badges animation
      const badges = cloudRef.current?.querySelectorAll('.skill-badge');
      if (badges) {
        gsap.from(badges, {
          scrollTrigger: {
            trigger: cloudRef.current,
            start: 'top 70%',
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        });

        // Floating animation for each badge
        badges.forEach((badge, index) => {
          const randomDelay = Math.random() * 2;
          const randomDuration = 2 + Math.random() * 2;
          const randomY = -10 - Math.random() * 10;

          gsap.to(badge, {
            y: randomY,
            duration: randomDuration,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: randomDelay,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-card/20"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Skills & <span className="text-primary">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            A diverse toolkit of technologies and frameworks I've mastered throughout my journey.
            Always learning, always growing.
          </p>

          {/* Category Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                  key === 'frontend' ? 'from-accent-blue to-accent-blue/50' :
                  key === 'backend' ? 'from-accent-green to-accent-green/50' :
                  key === 'devops' ? 'from-accent-purple to-accent-purple/50' :
                  'from-primary to-primary/50'
                }`}></div>
                <span className={`text-sm font-medium ${category.color}`}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Cloud */}
        <div
          ref={cloudRef}
          className="relative max-w-5xl mx-auto min-h-[600px] flex items-center justify-center"
        >
          {/* Background decorative circles */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-64 h-64 rounded-full border border-primary/20"></div>
            <div className="absolute w-96 h-96 rounded-full border border-primary/10"></div>
            <div className="absolute w-[500px] h-[500px] rounded-full border border-primary/5"></div>
          </div>

          {/* Skills Badges - Arranged in a cloud pattern */}
          <div className="relative flex flex-wrap justify-center items-center gap-3 p-8">
            {skillList.map((skill: Skill, index: number) => {
              // Randomize size based on proficiency
              const sizeClass = 
                skill.proficiency >= 85 ? 'text-lg px-6 py-3' :
                skill.proficiency >= 75 ? 'text-base px-5 py-2.5' :
                'text-sm px-4 py-2';
              
              const gradientColor = colorGradients[skill.category] || colorGradients.other;

              return (
                <div
                  key={skill._id}
                  className={`skill-badge group relative ${sizeClass} font-medium rounded-full border border-primary/20 bg-card/80 backdrop-blur-sm hover:border-primary hover:scale-110 transition-all duration-300 cursor-pointer`}
                  style={{
                    // Add slight random positioning offset for more organic feel
                    transform: `translateX(${(index % 3 - 1) * 5}px) translateY(${(index % 4 - 1.5) * 5}px)`,
                  }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${skill.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <span>{skill.name}</span>
                    
                    {/* Proficiency indicator (shows on hover) */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary font-mono">
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-lg bg-primary/20"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proficiency Scale */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
            <h3 className="text-lg font-heading font-bold mb-4 text-center">
              Proficiency Level Guide
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">85-100%</div>
                <div className="flex-1 h-2 rounded-full bg-accent-green/20">
                  <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-accent-green to-accent-blue"></div>
                </div>
                <div className="flex-shrink-0 w-20 text-sm font-medium text-accent-green">Expert</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">75-84%</div>
                <div className="flex-1 h-2 rounded-full bg-primary/20">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-primary to-accent-yellow"></div>
                </div>
                <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">Advanced</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">60-74%</div>
                <div className="flex-1 h-2 rounded-full bg-accent-purple/20">
                  <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-accent-purple to-accent-pink"></div>
                </div>
                <div className="flex-shrink-0 w-20 text-sm font-medium text-accent-purple">Intermediate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
