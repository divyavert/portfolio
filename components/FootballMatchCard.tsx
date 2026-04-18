'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getBarcelonaMatches, getMatchStatusText, type FootballMatch } from '@/lib/api/football';

export function FootballMatchCard() {
  const [match, setMatch] = useState<FootballMatch | null>(null);
  const [matchType, setMatchType] = useState<'live' | 'next' | 'last' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      setLoading(true);
      const { liveMatch, nextMatch, lastMatch } = await getBarcelonaMatches();
      
      // Priority: Live > Next > Last
      if (liveMatch) {
        setMatch(liveMatch);
        setMatchType('live');
      } else if (nextMatch) {
        setMatch(nextMatch);
        setMatchType('next');
      } else if (lastMatch) {
        setMatch(lastMatch);
        setMatchType('last');
      }
      
      setLoading(false);
    }

    fetchMatch();

    // Refresh every minute for live updates
    const interval = setInterval(fetchMatch, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !match) {
    return (
      <div className="currently-card gsap-hidden flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;
  const statusText = getMatchStatusText(match);

  return (
    <div className="currently-card gsap-hidden flex min-h-[280px] flex-col rounded-2xl border border-white/10 bg-surface-container p-5 shadow-[0_2px_10px_rgba(0,0,0,0.16)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="text-[10px] font-label font-bold uppercase tracking-[0.24em] text-primary">
          {matchType === 'live' ? 'LIVE MATCH' : 'NEXT MATCH'}
        </span>
        <span className="text-[11px] font-label uppercase tracking-[0.18em] text-muted-foreground">
          {statusText}
        </span>
      </div>

      <div className="mb-6 flex flex-1 items-center justify-center gap-6 rounded-2xl border border-white/8 bg-surface-container-high px-4 py-5">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-surface-bright p-2">
            <Image
              src={homeTeam.crest}
              alt={homeTeam.name}
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <p className="text-center text-sm font-body font-medium text-foreground">
            {homeTeam.shortName}
          </p>
        </div>

        <div className="text-sm font-label font-bold tracking-[0.18em] text-muted-foreground">
          VS
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-surface-bright p-2">
            <Image
              src={awayTeam.crest}
              alt={awayTeam.name}
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <p className="text-center text-sm font-body font-medium text-foreground">
            {awayTeam.shortName}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 bg-surface-container-high px-4 py-3">
        <p className="mb-1 text-[10px] font-label uppercase tracking-[0.22em] text-muted-foreground">
          Competition
        </p>
        <p className="text-sm font-medium text-foreground">{match.competition.name}</p>
      </div>
    </div>
  );
}
