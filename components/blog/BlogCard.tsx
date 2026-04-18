import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';
import { formatPublishedDate } from '@/lib/blog/utils';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  priority?: boolean;
}

function getAccent(index: number) {
  const accents = [
    'border-primary/20 bg-primary/10 text-primary',
    'border-accent-blue/20 bg-accent-blue/10 text-accent-blue',
    'border-tertiary/20 bg-tertiary/10 text-tertiary',
  ];

  return accents[index % accents.length];
}

export function BlogCard({ post, index = 0, priority = false }: BlogCardProps) {
  const heroImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(900).fit('crop').url()
    : null;

  const primaryCategory = post.categories?.[0] || 'Essay';

  return (
    <article className="blog-card group gsap-hidden overflow-hidden rounded-[28px] border border-white/10 bg-surface-container shadow-[0_10px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:bg-surface-container-high">
      <Link href={`/blog/${post.slug.current}`} className="flex h-full flex-col">
        <div className="relative aspect-[1.15/1] overflow-hidden bg-surface-container-high">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={post.mainImage?.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,144,105,0.24),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(0,227,253,0.18),_transparent_35%)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-surface-base/75 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-label font-bold uppercase tracking-[0.24em] ${getAccent(index)}`}>
              {primaryCategory}
            </span>
            {post.featured ? (
              <span className="inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-label font-bold uppercase tracking-[0.24em] text-white">
                Featured
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-4 text-[11px] font-label uppercase tracking-[0.18em] text-muted-foreground">
            <span>{formatPublishedDate(post.publishedAt)}</span>
            <span>{post.readingTime || 4} min read</span>
          </div>

          <div className="space-y-2">
            <h2 className="line-clamp-2 font-display text-2xl font-bold leading-tight text-foreground">
              {post.title}
            </h2>
            {post.excerpt ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {post.excerpt}
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-3">
            <div className="flex min-w-0 items-center gap-3">
              {post.author?.image ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).fit('crop').url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-xs font-label font-bold uppercase tracking-[0.2em] text-primary">
                  {post.author?.name?.slice(0, 2) || 'DP'}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{post.author?.name || 'Divya Panchori'}</p>
                <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {post.author?.role || 'Software Engineer'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-label font-bold uppercase tracking-[0.24em] text-primary transition-transform duration-300 group-hover:translate-x-1">
              Read
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
