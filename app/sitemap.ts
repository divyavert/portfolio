import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://divyapanchori.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: { slug: { current: string }; publishedAt: string }[] = [];

  try {
    blogPosts = await client.fetch(
      groq`*[_type == "blogPost"] { slug, publishedAt }`,
    );
  } catch {
    // Sanity unavailable at build time — sitemap still works for static pages
  }

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map(({ slug, publishedAt }) => ({
    url: `${BASE_URL}/blog/${slug.current}`,
    lastModified: publishedAt ? new Date(publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
