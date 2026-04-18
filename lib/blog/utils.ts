import type { PortableTextBlock } from '@portabletext/types';

interface PortableTextChild {
  _type?: string;
  text?: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: 'h2' | 'h3' | 'h4';
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatPublishedDate(date: string) {
  return DATE_FORMATTER.format(new Date(date));
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractHeadings(blocks: PortableTextBlock[] = []): HeadingItem[] {
  const headingCount = new Map<string, number>();

  return blocks.flatMap((block) => {
    if (
      block._type !== 'block' ||
      (block.style !== 'h2' && block.style !== 'h3' && block.style !== 'h4')
    ) {
      return [];
    }

    const text = (block.children as PortableTextChild[] | undefined)
      ?.map((child) => child.text || '')
      .join('')
      .trim();

    if (!text) {
      return [];
    }

    const baseId = slugifyHeading(text);
    const duplicateCount = headingCount.get(baseId) ?? 0;
    headingCount.set(baseId, duplicateCount + 1);

    return [{
      id: duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`,
      text,
      level: block.style,
    }];
  });
}

export function getShareLinks({ title, url }: { title: string; url: string }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };
}
