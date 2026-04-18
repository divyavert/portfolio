'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { BlogPost } from '@/lib/sanity/types';
import { BlogCard } from '@/components/blog/BlogCard';
import { SearchBar } from '@/components/blog/SearchBar';

gsap.registerPlugin(ScrollTrigger);

interface BlogListingClientProps {
  posts: BlogPost[];
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredPosts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return posts;
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.excerpt,
        post.author?.name,
        ...(post.categories || []),
        ...(post.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [deferredQuery, posts]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', immediateRender: false },
      );

      gsap.fromTo(
        gridRef.current?.querySelectorAll('.blog-card') || [],
        { y: 52, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          immediateRender: false,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredPosts.length]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,144,105,0.16),_transparent_28%),radial-gradient(circle_at_70%_10%,_rgba(0,227,253,0.14),_transparent_24%)]" />
      <div className="container relative mx-auto max-w-6xl">
        <div ref={heroRef} className="gsap-hidden mb-14 flex flex-col gap-8 rounded-[36px] border border-white/10 bg-surface-container-low/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-glass md:p-10">
          <div className="max-w-3xl space-y-5">
            <p className="text-[11px] font-label font-bold uppercase tracking-[0.32em] text-primary">
              Field notes
            </p>
            <h1 className="font-display text-5xl font-bold leading-none md:text-7xl">
              Essays on <span className="italic text-primary">building</span>, shipping, and staying curious.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Longer reflections from the engineering side of my work: systems I am exploring, patterns that hold up in production, and small observations worth writing down.
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SearchBar value={query} onChange={setQuery} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4">
                <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">Posts</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">{posts.length}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4">
                <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">Featured</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">
                  {posts.filter((post) => post.featured).length}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4 col-span-2 sm:col-span-1">
                <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">Reading shelf</p>
                <p className="mt-2 text-sm leading-6 text-foreground">Notes, breakdowns, and systems thinking.</p>
              </div>
            </div>
          </div>
        </div>

        {filteredPosts.length ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post._id} post={post} index={index} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-white/10 bg-surface-container/70 px-8 py-14 text-center">
            <p className="text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
              No match
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">Nothing surfaced for that search.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Try another keyword, category, or topic. Titles, excerpts, categories, and tags are all searchable here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
