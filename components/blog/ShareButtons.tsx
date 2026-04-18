'use client';

import { useState } from 'react';
import { Check, Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getShareLinks } from '@/lib/blog/utils';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const links = getShareLinks({ title, url });

  const actions = [
    {
      key: 'twitter',
      href: links.twitter,
      label: 'Share on X',
      icon: Twitter,
    },
    {
      key: 'linkedin',
      href: links.linkedin,
      label: 'Share on LinkedIn',
      icon: Linkedin,
    },
    {
      key: 'facebook',
      href: links.facebook,
      label: 'Share on Facebook',
      icon: Facebook,
    },
  ] as const;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-40 sm:right-6 lg:bottom-8 lg:right-8">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-glass/80 px-2 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-glass">
        {actions.map(({ key, href, label, icon: Icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Link copied' : 'Copy article link'}
          title={copied ? 'Link copied' : 'Copy article link'}
          className={cn(
            'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-label font-medium uppercase tracking-[0.18em] transition-colors',
            copied
              ? 'border-accent-green/20 bg-accent-green/10 text-accent-green'
              : 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="hidden pr-1 sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
