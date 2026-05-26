import HomePage from '@/components/HomePage';
import { client } from '@/lib/sanity/client';
import {
  personalInfoQuery,
  allProjectsQuery,
  allSkillsQuery,
  allExperienceQuery,
  currentlyLovingQuery,
  recentlyWatchedQuery,
  latestBlogPostQuery,
  skillSprintQuery,
} from '@/lib/sanity/queries';

export const revalidate = 60; // Revalidate every 60 seconds

async function getData() {
  try {
    const [
      personalInfo,
      projects,
      skills,
      experiences,
      currentlyLoving,
      recentlyWatched,
      latestBlogPost,
      skillSprint,
    ] = await Promise.all([
      client.fetch(personalInfoQuery),
      client.fetch(allProjectsQuery),
      client.fetch(allSkillsQuery),
      client.fetch(allExperienceQuery),
      client.fetch(currentlyLovingQuery),
      client.fetch(recentlyWatchedQuery),
      client.fetch(latestBlogPostQuery),
      client.fetch(skillSprintQuery),
    ]);

    return {
      personalInfo,
      projects,
      skills,
      experiences,
      currentlyLoving,
      recentlyWatched,
      latestBlogPost,
      skillSprint,
    };
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    // Return null data if Sanity fetch fails - components will use fallback data
    return {
      personalInfo: null,
      projects: [],
      skills: [],
      experiences: [],
      currentlyLoving: null,
      recentlyWatched: null,
      latestBlogPost: null,
      skillSprint: null,
    };
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://divyapanchori.vercel.app';

export default async function Page() {
  const data = await getData();
  const info = data.personalInfo;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: info?.name ?? 'Divya Panchori',
    url: BASE_URL,
    email: info?.email ?? undefined,
    jobTitle: 'Software Engineer',
    description:
      'Software Engineer specializing in React, Go, and AI-integrated applications.',
    knowsAbout: [
      'React',
      'TypeScript',
      'Go',
      'Next.js',
      'AI',
      'Frontend Development',
    ],
    sameAs: [
      info?.social?.github,
      info?.social?.linkedin,
      info?.social?.twitter,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage
        personalInfo={data.personalInfo}
        projects={data.projects}
        skills={data.skills}
        experiences={data.experiences}
        currentlyLoving={data.currentlyLoving}
        recentlyWatched={data.recentlyWatched}
        latestBlogPost={data.latestBlogPost}
        skillSprint={data.skillSprint}
      />
    </>
  );
}
