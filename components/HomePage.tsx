'use client';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import Currently from '@/components/sections/Currently';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import type {
  PersonalInfo,
  Project,
  Skill,
  Experience as ExperienceType,
  CurrentlyLoving,
  RecentlyWatched,
  BlogPost,
  SkillSprint,
} from '@/lib/sanity/types';

interface HomePageProps {
  personalInfo: PersonalInfo | null;
  projects: Project[];
  skills: Skill[];
  experiences: ExperienceType[];
  currentlyLoving: CurrentlyLoving | null;
  recentlyWatched: RecentlyWatched | null;
  latestBlogPost: BlogPost | null;
  skillSprint: SkillSprint | null;
}

export default function HomePage({
  personalInfo,
  projects,
  skills,
  experiences,
  currentlyLoving,
  recentlyWatched,
  latestBlogPost,
  skillSprint,
}: HomePageProps) {
  return (
    <>
      <Navigation />
      <main className='min-h-screen'>
        <Hero personalInfo={personalInfo} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Currently
          currentlyLoving={currentlyLoving}
          recentlyWatched={recentlyWatched}
          latestBlogPost={latestBlogPost}
          personalInfo={personalInfo}
          skillSprint={skillSprint}
        />
        <Contact personalInfo={personalInfo} />
      </main>
      <Footer />
    </>
  );
}
