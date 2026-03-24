'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getBarcelonaMatches, getMatchStatusText, isBarcelonaHome, type FootballMatch } from '@/lib/api/football';

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
      <div className="currently-card bg-gradient-to-br from-[#004d98]/10 to-[#a50044]/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 transition-all duration-300">
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#a50044]"></div>
        </div>
      </div>
    );
  }

  const isHome = isBarcelonaHome(match);
  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;
  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const statusText = getMatchStatusText(match);
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <div className="currently-card bg-gradient-to-br from-[#004d98]/10 to-[#a50044]/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 hover:border-[#a50044]/50 transition-all duration-300 group hover:scale-[1.02]">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-foreground">
            {matchType === 'live' ? '🔴 LIVE' : matchType === 'next' ? 'Next Match' : 'Last Match'}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {match.venue || 'Stadium TBA'}
        </p>
        <p className="text-xs text-muted-foreground">
          {match.competition.name} • {matchType !== 'next' && !isLive ? statusText : ''}
        </p>
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-background/50 p-1">
            <Image
              src={homeTeam.crest}
              alt={homeTeam.name}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-foreground">{homeTeam.tla}</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
              {homeTeam.shortName}
            </p>
            <p className="text-[9px] text-muted-foreground/70">
              {isHome ? 'Home' : 'Away'}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-heading font-bold text-foreground">
              {homeScore ?? '-'}
            </span>
            <span className="text-xl font-bold text-muted-foreground">:</span>
            <span className="text-2xl font-heading font-bold text-foreground">
              {awayScore ?? '-'}
            </span>
          </div>
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#a50044]/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a50044] animate-pulse"></div>
              <span className="text-[10px] font-bold text-[#a50044]">
                {match.minute ? `${match.minute}'` : 'LIVE'}
              </span>
            </div>
          )}
          {!isLive && matchType === 'next' && (
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-accent-green/10 rounded-full">
              {statusText}
            </span>
          )}
          {isFinished && (
            <span className="text-[10px] text-muted-foreground">
              Full Time
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-background/50 p-1">
            <Image
              src={awayTeam.crest}
              alt={awayTeam.name}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-foreground">{awayTeam.tla}</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[80px]">
              {awayTeam.shortName}
            </p>
            <p className="text-[9px] text-muted-foreground/70">
              {isHome ? 'Away' : 'Home'}
            </p>
          </div>
        </div>
      </div>

      {/* Competition Badge */}
      <div className="flex items-center justify-center pt-3 border-t border-primary/10">
        <div className="flex items-center gap-2">
          {match.competition.emblem && (
            <div className="relative w-4 h-4">
              <Image
                src={match.competition.emblem}
                alt={match.competition.name}
                fill
                className="object-contain"
                sizes="16px"
              />
            </div>
          )}
          <span className="text-xs text-muted-foreground font-medium">
            {match.competition.name}
            {match.matchday && ` • MD ${match.matchday}`}
          </span>
        </div>
      </div>
    </div>
  );
}
