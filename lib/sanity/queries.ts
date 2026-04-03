import { groq } from 'next-sanity';

// Personal Info Query
export const personalInfoQuery = groq`
  *[_type == "personalInfo"][0] {
    _id,
    name,
    tagline,
    bio,
    email,
    phone,
    location,
    profileImage,
    resumeFile,
    social,
    stats
  }
`;

// Projects Queries
export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    "shortDescription": shortDescription,
    description,
    thumbnail,
    "technologies": techStack,
    category,
    liveUrl,
    githubUrl,
    featured,
    order,
    status
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    "shortDescription": shortDescription,
    description,
    thumbnail,
    "technologies": techStack,
    category,
    liveUrl,
    githubUrl,
    featured
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "description": shortDescription,
    thumbnail,
    "technologies": techStack,
    category,
    liveUrl,
    githubUrl,
    featured,
    order,
    status
  }
`;

// Skills Queries
export const allSkillsQuery = groq`
  *[_type == "skill"] | order(order asc) {
    _id,
    name,
    category,
    proficiency,
    icon,
    color,
    order
  }
`;

export const skillsByCategoryQuery = groq`
  *[_type == "skill" && category == $category] | order(order asc) {
    _id,
    name,
    category,
    proficiency,
    icon,
    color,
    order
  }
`;

// Experience Queries
export const allExperienceQuery = groq`
  *[_type == "experience"] | order(startDate desc) {
    _id,
    company,
    "position": role,
    location,
    startDate,
    endDate,
    "current": isCurrent,
    description,
    "technologies": techStack,
    achievements,
    companyLogo,
    companyUrl,
    order
  }
`;

// Blog Post Queries
export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    featured,
    author->{
      name,
      slug,
      image,
      role
    }
  }
`;

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    featured,
    author->{
      name,
      slug,
      image,
      role
    }
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    body,
    readingTime,
    featured,
    seo,
    author->{
      name,
      slug,
      image,
      bio,
      role,
      social
    }
  }
`;

export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPost" && $category in categories] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    featured,
    author->{
      name,
      slug,
      image,
      role
    }
  }
`;

export const blogPostsByTagQuery = groq`
  *[_type == "blogPost" && $tag in tags] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    featured,
    author->{
      name,
      slug,
      image,
      role
    }
  }
`;

// Author Query
export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    role,
    social
  }
`;

// Related Posts Query
export const relatedBlogPostsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug && (
    count((categories[])[@ in $categories]) > 0 ||
    count((tags[])[@ in $tags]) > 0
  )] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    author->{
      name,
      slug,
      image,
      role
    }
  }
`;

// Latest Blog Post Query
export const latestBlogPostQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) [0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    categories,
    tags,
    publishedAt,
    readingTime,
    featured
  }
`;

// Currently Loving Query
export const currentlyLovingQuery = groq`
  *[_type == "currentlyLoving" && active == true][0] {
    _id,
    songName,
    artistName,
    albumName,
    albumCover,
    spotifyUrl
  }
`;

// Recently Watched Query
export const recentlyWatchedQuery = groq`
  *[_type == "recentlyWatched" && active == true] | order(watchedDate desc) [0] {
    _id,
    title,
    type,
    year,
    rating,
    poster,
    genre,
    thoughts,
    watchedDate
  }
`;

// Skill Sprint Query
export const skillSprintQuery = groq`
  *[_type == "skillSprint" && active == true][0] {
    _id,
    courseName,
    progress,
    upNextLesson,
    icon
  }
`;
