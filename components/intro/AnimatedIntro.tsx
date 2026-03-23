'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function AnimatedIntro({ onComplete }: { onComplete: () => void }) {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 300);
        },
      });

      // Logo animation
      tl.from(logoRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
        .from(
          textRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .to(
          {},
          {
            duration: 0.5,
          }
        )
        .to([logoRef.current, textRef.current], {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.in',
        })
        .to(
          introRef.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          '-=0.2'
        );
    }, introRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <div ref={logoRef} className="mb-6">
          <div className="relative mx-auto h-32 w-32">
            {/* Outer ring with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-20 blur-xl animate-pulse"></div>
            
            {/* Main logo circle */}
            <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-primary/30 bg-background/50 backdrop-blur-sm">
              {/* Inner content - DP initials */}
              <div className="text-5xl font-bold">
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  DP
                </span>
              </div>
              
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div ref={textRef} className="space-y-2">
          <p className="text-lg font-medium text-foreground">Divya Panchori</p>
          <div className="flex items-center justify-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
