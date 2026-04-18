'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search essays, notes, and builds"
        className="h-14 w-full rounded-full border border-white/10 bg-surface-glass/70 pl-14 pr-14 text-sm text-foreground outline-none ring-0 backdrop-blur-glass placeholder:text-muted-foreground focus:border-primary/40"
        aria-label="Search blog posts"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-high text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
