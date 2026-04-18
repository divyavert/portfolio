"use client";

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Always start at the top on a hard refresh.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return <>{children}</>;
}
