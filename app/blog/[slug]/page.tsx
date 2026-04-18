import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { BlogArticleClient } from '@/components/blog/BlogArticleClient';
import { BlogCard } from '@/components/blog/BlogCard';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { extractHeadings } from '@/lib/blog/utils';
import { client } from '@/lib/sanity/client';
import { blogPostBySlugQuery, relatedBlogPostsQuery, allBlogPostsQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import type { BlogPost } from '@/lib/sanity/types';

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await client.fetch<BlogPost | null>(blogPostBySlugQuery, { slug });

    if (!post) {
      return null;
    }

    const relatedPosts = await client.fetch<BlogPost[]>(relatedBlogPostsQuery, {
      slug,
      categories: post.categories || [],
      tags: post.tags || [],
    });

    return { post, relatedPosts };
  } catch (error) {
    console.error('Error fetching blog post from Sanity:', error);
    return null;
  }
}

export async function generateStaticParams() {
  const posts = await client.fetch<BlogPost[]>(allBlogPostsQuery);
  return posts.map((post) => ({ slug: post.slug.current }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<BlogPost | null>(blogPostBySlugQuery, { slug });

  if (!post) {
    return {
      title: 'Post not found | Divya Panchori',
    };
  }

  const title = post.seo?.metaTitle || `${post.title} | Divya Panchori`;
  const description = post.seo?.metaDescription || post.excerpt || 'Read the latest writing from Divya Panchori.';
  const ogImage = post.seo?.ogImage || post.mainImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage ? [{ url: urlFor(ogImage).width(1200).height(630).fit('crop').url() }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [urlFor(ogImage).width(1200).height(630).fit('crop').url()] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const data = await getBlogPost(slug);

  if (!data?.post) {
    notFound();
  }

  const headings = extractHeadings(data.post.body || []);
  const shareUrl = `https://divyapanchori.dev/blog/${data.post.slug.current}`;

  return (
    <>
      <Navigation />
      <ReadingProgressBar />
      <main className="min-h-screen bg-background">
        <BlogArticleClient post={data.post} headings={headings} shareUrl={shareUrl} />

        <div className="px-4 pb-24">
          <div className="container mx-auto max-w-6xl space-y-8">
            <AuthorBio author={data.post.author} />

            {data.relatedPosts.length ? (
              <section>
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
                      Keep reading
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                      Related notes and essays
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {data.relatedPosts.map((post, index) => (
                    <BlogCard key={post._id} post={post} index={index} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
