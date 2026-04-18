'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeadingItem {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
}

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id || null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleHeading?.target.id) {
          setActiveId(visibleHeading.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[28px] border border-white/10 bg-surface-container/80 p-5 backdrop-blur-glass md:p-6">
      <p className="mb-4 text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
        On this page
      </p>
      <nav aria-label="Table of contents" className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              'block rounded-2xl px-3 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground',
              heading.level === 'h3' && 'text-[13px]',
              heading.level === 'h4' && 'text-[13px]',
              activeId === heading.id && 'bg-surface-container-high text-foreground',
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
