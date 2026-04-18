import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { BlogListingClient } from '@/components/blog/BlogListingClient';
import { client } from '@/lib/sanity/client';
import { allBlogPostsQuery } from '@/lib/sanity/queries';
import type { BlogPost } from '@/lib/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | Divya Panchori',
  description: 'Essays, technical notes, and behind-the-build writeups from Divya Panchori.',
  openGraph: {
    title: 'Blog | Divya Panchori',
    description: 'Essays, technical notes, and behind-the-build writeups from Divya Panchori.',
    type: 'website',
  },
};

async function getBlogPosts() {
  try {
    return await client.fetch<BlogPost[]>(allBlogPostsQuery);
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <BlogListingClient posts={posts} />
      </main>
      <Footer />
    </>
  );
}
