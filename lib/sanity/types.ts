import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableTextBlock } from '@portabletext/types';

export interface PersonalInfo {
  _id: string;
  name: string;
  tagline: string;
  bio: PortableTextBlock[];
  email: string;
  phone?: string;
  location: string;
  profileImage: SanityImageSource;
  resumeFile?: {
    asset: {
      url: string;
    };
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    technologiesMastered: number;
    coffeesCoded?: number;
  };
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  longDescription?: PortableTextBlock[];
  image: SanityImageSource;
  gallery?: SanityImageSource[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  startDate: string;
  endDate?: string;
  order: number;
  challenges?: string[];
  learnings?: string[];
}

export interface Skill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'other';
  proficiency: number;
  icon?: string;
  color?: string;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  companyLogo?: SanityImageSource;
  companyUrl?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image: SanityImageSource;
  bio?: PortableTextBlock[];
  role?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  mainImage: SanityImageSource;
  categories: string[];
  tags: string[];
  publishedAt: string;
  body?: PortableTextBlock[];
  readingTime?: number;
  featured: boolean;
  author: Author;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
  };
}

export interface CurrentlyLoving {
  _id: string;
  songName: string;
  artistName: string;
  albumName?: string;
  albumCover?: SanityImageSource;
  spotifyUrl?: string;
}

export interface RecentlyWatched {
  _id: string;
  title: string;
  type: 'movie' | 'show';
  year?: number;
  rating?: number;
  poster?: SanityImageSource;
  genre?: string;
  thoughts?: string;
  watchedDate: string;
}
