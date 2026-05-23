'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, FileText, Hash, Star } from 'lucide-react';
import type { BlogPost } from '@/lib/sanity/types';
import { BlogCard } from '@/components/blog/BlogCard';
import { SearchBar } from '@/components/blog/SearchBar';

gsap.registerPlugin(ScrollTrigger);

interface BlogListingClientProps {
  posts: BlogPost[];
}

export function BlogListingClient({ posts }: BlogListingClientProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statPostsRef = useRef<HTMLParagraphElement>(null);
  const statFeaturedRef = useRef<HTMLParagraphElement>(null);

  const categories = useMemo(() => {
    const catSet = new Set<string>();
    posts.forEach((p) => (p.categories || []).forEach((c) => catSet.add(c)));
    return Array.from(catSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    return posts.filter((post) => {
      if (activeCategory && !(post.categories || []).includes(activeCategory)) return false;
      if (!normalized) return true;

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
  }, [deferredQuery, posts, activeCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', immediateRender: false },
      );

      const postCountEl = statPostsRef.current;
      const featuredCountEl = statFeaturedRef.current;
      const featuredCount = posts.filter((p) => p.featured).length;

      if (postCountEl) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: posts.length,
          duration: 1.2,
          delay: 0.6,
          ease: 'power2.out',
          onUpdate() {
            postCountEl.textContent = Math.round(obj.val).toString();
          },
        });
      }

      if (featuredCountEl) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: featuredCount,
          duration: 1.2,
          delay: 0.7,
          ease: 'power2.out',
          onUpdate() {
            featuredCountEl.textContent = Math.round(obj.val).toString();
          },
        });
      }

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
  }, [filteredPosts.length, posts]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 pb-24 pt-32">
      {/* Radial colour wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,144,105,0.16),_transparent_28%),radial-gradient(circle_at_70%_10%,_rgba(0,227,253,0.14),_transparent_24%)]" />
      {/* Dot-grid texture fading downward */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,black,transparent)]" />

      <div className="container relative mx-auto max-w-6xl">
        {/* Hero card */}
        <div
          ref={heroRef}
          className="gsap-hidden relative mb-14 overflow-hidden rounded-[36px] border border-white/10 bg-surface-container-low/70 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-glass"
        >
          {/* Top-edge inner glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent" />

          <div className="p-8 md:p-10">
            {/* Eyebrow + title */}
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
                  Field notes
                </span>
              </div>

              <h1 className="font-display text-5xl font-bold leading-none md:text-7xl">
                Essays on{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text italic text-transparent">
                  building
                </span>
                , shipping, and staying curious.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Longer reflections from the engineering side of my work: systems I&apos;m exploring, patterns
                that hold up in production, and small observations worth writing down.
              </p>
            </div>

            {/* Divider */}
            <div className="my-7 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.10] to-white/[0.04]" />

            {/* Search + stats row */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              {/* Search + category pills */}
              <div className="flex flex-col gap-3">
                <SearchBar value={query} onChange={setQuery} />

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-label uppercase tracking-[0.2em] transition-colors ${
                        activeCategory === null
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                        className={`rounded-full border px-3 py-1 text-[11px] font-label uppercase tracking-[0.2em] transition-colors ${
                          activeCategory === cat
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">
                      Posts
                    </p>
                  </div>
                  <p ref={statPostsRef} className="mt-2 font-display text-3xl font-bold text-foreground">
                    {posts.length}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">
                      Featured
                    </p>
                  </div>
                  <p ref={statFeaturedRef} className="mt-2 font-display text-3xl font-bold text-foreground">
                    {posts.filter((p) => p.featured).length}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-surface-container/80 px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] font-label uppercase tracking-[0.24em] text-muted-foreground">
                      Topics
                    </p>
                  </div>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">{categories.length}</p>
                </div>
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
            <p className="text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">No match</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
              Nothing surfaced for that search.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Try another keyword, category, or topic. Titles, excerpts, categories, and tags are all searchable
              here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
