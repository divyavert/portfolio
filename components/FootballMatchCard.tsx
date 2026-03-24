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
      <div className="currently-card bg-surface-container rounded-xl p-6 min-h-[280px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;
  const statusText = getMatchStatusText(match);

  return (
    <div className="currently-card bg-surface-container rounded-xl p-6 min-h-[280px] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs font-label font-bold text-primary tracking-wider uppercase">
          {matchType === 'live' ? 'LIVE MATCH' : 'NEXT MATCH'}
        </span>
        <span className="text-xs text-muted-foreground font-label">
          {statusText}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-center gap-8 mb-6 flex-1">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-bright p-2">
            <Image
              src={homeTeam.crest}
              alt={homeTeam.name}
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <p className="text-sm font-body font-medium text-white text-center">
            {homeTeam.shortName}
          </p>
        </div>

        {/* VS Divider */}
        <div className="text-muted-foreground text-sm font-label font-bold">
          VS
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-bright p-2">
            <Image
              src={awayTeam.crest}
              alt={awayTeam.name}
              fill
              className="object-contain p-2"
              sizes="64px"
            />
          </div>
          <p className="text-sm font-body font-medium text-white text-center">
            {awayTeam.shortName}
          </p>
        </div>
      </div>

      {/* Set Reminder Button (visual only) */}
      <button className="w-full py-2.5 rounded-full bg-surface-bright text-sm text-muted font-body hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
        Set Reminder
      </button>
    </div>
  );
}
