'use client';

import { useState } from 'react';
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import Currently from "@/components/sections/Currently";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import AnimatedIntro from "@/components/intro/AnimatedIntro";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={() => setShowIntro(false)} />}
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <Currently />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
