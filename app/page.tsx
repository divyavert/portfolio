import HomePage from "@/components/HomePage";
import { client } from "@/lib/sanity/client";
import { 
  personalInfoQuery, 
  allProjectsQuery, 
  allSkillsQuery, 
  allExperienceQuery,
  currentlyLovingQuery,
  recentlyWatchedQuery,
  latestBlogPostQuery,
  skillSprintQuery
} from "@/lib/sanity/queries";

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
      skillSprint
    ] = await Promise.all([
      client.fetch(personalInfoQuery),
      client.fetch(allProjectsQuery),
      client.fetch(allSkillsQuery),
      client.fetch(allExperienceQuery),
      client.fetch(currentlyLovingQuery),
      client.fetch(recentlyWatchedQuery),
      client.fetch(latestBlogPostQuery),
      client.fetch(skillSprintQuery)
    ]);

    return {
      personalInfo,
      projects,
      skills,
      experiences,
      currentlyLoving,
      recentlyWatched,
      latestBlogPost,
      skillSprint
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
      skillSprint: null
    };
  }
}

export default async function Page() {
  const data = await getData();

  return (
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
  );
}
