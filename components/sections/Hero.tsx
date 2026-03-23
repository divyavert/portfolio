'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Profile card animation
      tl.from(profileCardRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
        // Title animation - split by words
        .from(
          titleRef.current?.querySelectorAll('.title-word') || [],
          {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        // Subtitle
        .from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        // Stats cards
        .from(
          statsRef.current?.querySelectorAll('.stat-card') || [],
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        )
        // Button
        .from(
          buttonRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.2'
        );

      // Floating animation for profile card
      gsap.to(profileCardRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        
        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Profile Card */}
          <div ref={profileCardRef} className="perspective-1000">
            <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-primary/10 relative overflow-hidden group">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Profile Image Placeholder - will be replaced with Sanity image */}
                <div className="w-48 h-48 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-purple/20 flex items-center justify-center text-6xl relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                  <span className="relative z-10">DP</span>
                </div>
                
                <h2 className="text-3xl font-heading font-bold text-center mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Divya Panchori
                </h2>
                
                <p className="text-center text-primary font-medium mb-2 text-lg">
                  Software Engineer
                </p>
                
                <p className="text-center text-muted-foreground mb-6 text-sm leading-relaxed px-4">
                  Crafting innovative solutions with clean code and creative thinking
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3">
                  <a
                    href="https://github.com/divyavert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-12 h-12 rounded-xl bg-card-hover border border-primary/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/divya-panchori"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-12 h-12 rounded-xl bg-card-hover border border-primary/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="mailto:dpanchori94@gmail.com"
                    className="group/social w-12 h-12 rounded-xl bg-card-hover border border-primary/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Email"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Title & Stats */}
          <div>
            <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
              <span className="block title-word overflow-hidden">
                <span className="inline-block text-foreground">SOFTWARE</span>
              </span>
              <span className="block title-word overflow-hidden">
                <span className="inline-block bg-gradient-to-r from-primary via-accent-purple to-primary bg-clip-text text-transparent">
                  ENGINEER
                </span>
              </span>
            </h1>
            
            <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Passionate about creating <span className="text-primary font-medium">intuitive</span> and{' '}
              <span className="text-primary font-medium">engaging</span> user experiences.
              Transforming ideas into beautifully crafted digital products.
            </p>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="stat-card bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-primary/10 hover:border-primary/30 transition-colors group">
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-br from-primary to-accent-purple bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  2+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground leading-tight">
                  YEARS OF<br />EXPERIENCE
                </div>
              </div>
              <div className="stat-card bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-primary/10 hover:border-primary/30 transition-colors group">
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-br from-primary to-accent-purple bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  10+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground leading-tight">
                  PROJECTS<br />COMPLETED
                </div>
              </div>
              <div className="stat-card bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-primary/10 hover:border-primary/30 transition-colors group">
                <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-br from-primary to-accent-purple bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  37+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground leading-tight">
                  USERS<br />IMPACTED
                </div>
              </div>
            </div>

            <a
              ref={buttonRef}
              href="/resume.pdf"
              download
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent-purple text-primary-foreground rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground font-mono">SCROLL</span>
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
