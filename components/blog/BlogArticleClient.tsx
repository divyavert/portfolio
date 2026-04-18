'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { BlogPost } from '@/lib/sanity/types';
import { formatPublishedDate } from '@/lib/blog/utils';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BlogContent } from '@/components/blog/BlogContent';

gsap.registerPlugin(ScrollTrigger);

interface HeadingItem {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
}

interface BlogArticleClientProps {
  post: BlogPost;
  headings: HeadingItem[];
  shareUrl: string;
}

export function BlogArticleClient({ post, headings, shareUrl }: BlogArticleClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 42, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', immediateRender: false },
      );

      gsap.fromTo(
        [articleRef.current, sidebarRef.current],
        { y: 48, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top 82%',
          },
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,144,105,0.14),_transparent_30%),radial-gradient(circle_at_80%_10%,_rgba(165,140,255,0.14),_transparent_26%)]" />
      <div className="container relative mx-auto max-w-6xl">
        <div ref={heroRef} className="gsap-hidden mb-12 rounded-[36px] border border-white/10 bg-surface-container-low/75 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-glass md:p-10">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full border border-white/10 bg-surface-container-high px-4 py-2 text-[11px] font-label font-bold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to blog
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-label uppercase tracking-[0.22em] text-muted-foreground">
            <span>{formatPublishedDate(post.publishedAt)}</span>
            <span className="text-border">/</span>
            <span>{post.readingTime || 4} min read</span>
            {post.categories?.[0] ? (
              <>
                <span className="text-border">/</span>
                <span className="text-primary">{post.categories[0]}</span>
              </>
            ) : null}
          </div>

          <div className="mt-5 max-w-4xl space-y-5">
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
          </div>

          {post.tags?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-surface-container-high px-3 py-1.5 text-[10px] font-label font-bold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <div ref={sidebarRef} className="gsap-hidden">
            <TableOfContents headings={headings} />
          </div>

          <article ref={articleRef} className="gsap-hidden rounded-[36px] border border-white/10 bg-surface-container p-6 shadow-[0_12px_40px_rgba(0,0,0,0.16)] md:p-8 lg:p-10 xl:p-12">
            <BlogContent value={post.body} />
          </article>
        </div>

        <ShareButtons title={post.title} url={shareUrl} />
      </div>
    </section>
  );
}
