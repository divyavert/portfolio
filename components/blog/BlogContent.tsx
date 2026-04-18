import Image from 'next/image';
import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Highlight, themes } from 'prism-react-renderer';
import type { PortableTextBlock } from '@portabletext/types';
import { slugifyHeading } from '@/lib/blog/utils';
import { urlFor } from '@/lib/sanity/image';
import type { SanityImageWithAlt } from '@/lib/sanity/types';

interface BlogContentProps {
  value?: PortableTextBlock[];
}

interface PortableCodeBlock {
  _type?: string;
  code?: string;
  language?: string;
  filename?: string;
}

interface HighlightRenderProps {
  className: string;
  style: React.CSSProperties;
  tokens: Array<Array<{ types: string[]; content: string }>>;
  getLineProps: (input: {
    line: Array<{ types: string[]; content: string }>;
    key: number;
  }) => React.HTMLAttributes<HTMLElement>;
  getTokenProps: (input: {
    token: { types: string[]; content: string };
    key: number;
  }) => React.HTMLAttributes<HTMLElement>;
}

interface PortableImageValue extends SanityImageWithAlt {
  _type?: string;
}

function CodeBlock({ value }: { value?: PortableCodeBlock }) {
  const code = value?.code?.trimEnd();
  const language = (value?.language || 'tsx') as Parameters<
    typeof Highlight
  >[0]['language'];

  if (!code) {
    return null;
  }

  return (
    <div className='my-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#121217] shadow-[0_12px_40px_rgba(0,0,0,0.24)]'>
      <div className='flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-3 text-[11px] font-label uppercase tracking-[0.24em] text-muted-foreground'>
        <span>{value?.filename || language}</span>
        <span>snippet</span>
      </div>
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }: HighlightRenderProps) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-sm`}
            style={{ ...style, margin: 0, background: 'transparent' }}
          >
            {tokens.map((line, index) => {
              const lineProps = getLineProps({ line, key: index });

              return (
                <div key={index} {...lineProps} className='table-row'>
                  <span className='table-cell select-none pr-6 text-right text-xs text-white/30'>
                    {index + 1}
                  </span>
                  <span className='table-cell'>
                    {line.map((token, tokenIndex) => (
                      <span
                        key={tokenIndex}
                        {...getTokenProps({ token, key: tokenIndex })}
                      />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className='mb-5 text-[17px] leading-8 text-muted-foreground'>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className='mb-6 mt-12 font-display text-4xl font-bold leading-tight text-foreground'>
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const text = Array.isArray(children)
        ? children.join('')
        : String(children || '');
      const id = slugifyHeading(text);
      return (
        <h2
          id={id}
          className='scroll-mt-28 mb-5 mt-14 font-display text-3xl font-bold leading-tight text-foreground'
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = Array.isArray(children)
        ? children.join('')
        : String(children || '');
      const id = slugifyHeading(text);
      return (
        <h3
          id={id}
          className='scroll-mt-28 mb-4 mt-10 font-display text-2xl font-bold leading-tight text-foreground'
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = Array.isArray(children)
        ? children.join('')
        : String(children || '');
      const id = slugifyHeading(text);
      return (
        <h4
          id={id}
          className='scroll-mt-28 mb-4 mt-8 font-heading text-xl font-semibold text-foreground'
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className='my-8 rounded-[28px] border border-primary/20 bg-primary/10 px-6 py-5 font-display text-2xl italic leading-relaxed text-foreground'>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className='mb-6 list-disc space-y-3 pl-6 text-[17px] leading-8 text-muted-foreground'>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className='mb-6 list-decimal space-y-3 pl-6 text-[17px] leading-8 text-muted-foreground'>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className='font-semibold text-foreground'>{children}</strong>
    ),
    em: ({ children }) => (
      <em className='italic text-foreground'>{children}</em>
    ),
    code: ({ children }) => (
      <code className='rounded-lg border border-white/10 bg-surface-container-high px-2 py-1 font-mono text-[0.9em] text-accent-blue'>
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '#';
      const isInternal = href.startsWith('/');

      if (isInternal) {
        return (
          <Link
            href={href}
            className='font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-foreground'
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-foreground'
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const image = value as PortableImageValue;

      if (!image?.asset) {
        return null;
      }

      return (
        <figure className='my-10 overflow-hidden rounded-[32px] border border-white/10 bg-surface-container-high'>
          <div className='relative aspect-[16/9]'>
            <Image
              src={urlFor(image).width(1600).height(900).fit('crop').url()}
              alt={image.alt || 'Blog image'}
              fill
              className='object-cover'
              sizes='(max-width: 1024px) 100vw, 900px'
            />
          </div>
          {image.caption ? (
            <figcaption className='px-5 py-4 text-sm leading-6 text-muted-foreground'>
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    code: ({ value }) => <CodeBlock value={value as PortableCodeBlock} />,
    undefined: ({ value }) => {
      const fallback = value as PortableCodeBlock;

      if (typeof fallback?.code === 'string') {
        return <CodeBlock value={fallback} />;
      }

      return null;
    },
  },
};

export function BlogContent({ value }: BlogContentProps) {
  if (!value?.length) {
    return (
      <div className='rounded-[28px] border border-dashed border-white/10 bg-surface-container/70 px-6 py-8 text-sm text-muted-foreground'>
        This post does not have body content yet.
      </div>
    );
  }

  return (
    <div className='blog-prose'>
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
