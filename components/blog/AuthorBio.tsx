import Image from 'next/image';
import { Globe, Github, Linkedin, Twitter } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import type { Author } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/image';

interface AuthorBioProps {
  author?: Author;
}

const socialConfig = [
  { key: 'twitter', icon: Twitter, label: 'Twitter' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'github', icon: Github, label: 'GitHub' },
  { key: 'website', icon: Globe, label: 'Website' },
] as const;

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-sm leading-6 text-muted-foreground">{children}</p>
    ),
  },
};

type PortableBio = Exclude<NonNullable<Author['bio']>, string>;

function hasPortableTextBio(bio: Author['bio'] | string | undefined): bio is PortableBio {
  return Array.isArray(bio);
}

export function AuthorBio({ author }: AuthorBioProps) {
  if (!author) {
    return null;
  }

  const portableBio = hasPortableTextBio(author.bio) ? author.bio : undefined;

  return (
    <section className="rounded-[32px] border border-white/10 bg-surface-container p-6 shadow-[0_10px_40px_rgba(0,0,0,0.16)]">
      <p className="mb-4 text-[11px] font-label font-bold uppercase tracking-[0.28em] text-primary">
        About the author
      </p>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-white/10 bg-surface-container-high">
          {author.image ? (
            <Image
              src={urlFor(author.image).width(160).height(160).fit('crop').url()}
              alt={author.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : null}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">{author.name}</h2>
            {author.role ? (
              <p className="text-xs font-label uppercase tracking-[0.22em] text-muted-foreground">
                {author.role}
              </p>
            ) : null}
          </div>

          {typeof author.bio === 'string' ? (
            <p className="text-sm leading-6 text-muted-foreground">{author.bio}</p>
          ) : null}

          {portableBio?.length ? (
            <PortableText value={portableBio} components={portableTextComponents} />
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            {socialConfig.map(({ key, icon: Icon, label }) => {
              const href = author.social?.[key];

              if (!href) {
                return null;
              }

              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-container-high px-3 py-2 text-xs font-label font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
