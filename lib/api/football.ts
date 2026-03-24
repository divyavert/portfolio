// Football-Data.org API Integration
// Free tier: 10 requests/minute, covers major European leagues
// API Docs: https://www.football-data.org/documentation/quickstart

const BARCELONA_TEAM_ID = 81; // FC Barcelona team ID

export interface FootballMatch {
  id: number;
  competition: {
    name: string;
    emblem: string;
  };
  season: {
    currentMatchday: number;
  };
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  matchday: number;
  venue: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string; // Three Letter Abbreviation
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  minute?: number; // Current minute (only during live matches)
}

interface FootballApiResponse {
  matches: FootballMatch[];
}

/**
 * Fetch Barcelona's matches (next, live, or recent)
 * Calls our Next.js API route to avoid CORS issues
 */
export async function getBarcelonaMatches(): Promise<{
  liveMatch: FootballMatch | null;
  nextMatch: FootballMatch | null;
  lastMatch: FootballMatch | null;
}> {
  try {
    const response = await fetch('/api/football/barcelona', {
      next: {
        revalidate: 60, // Cache for 1 minute
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      liveMatch: data.liveMatch,
      nextMatch: data.nextMatch,
      lastMatch: data.lastMatch,
    };
  } catch (error) {
    console.error('Error fetching Barcelona matches:', error);
    return { liveMatch: null, nextMatch: null, lastMatch: null };
  }
}

/**
 * Format match time/status for display
 */
export function getMatchStatusText(match: FootballMatch): string {
  switch (match.status) {
    case 'IN_PLAY':
      return match.minute ? `${match.minute}'` : 'LIVE';
    case 'PAUSED':
      return 'HT'; // Half Time
    case 'FINISHED':
      return 'FT'; // Full Time
    case 'SCHEDULED':
    case 'TIMED':
      const matchDate = new Date(match.utcDate);
      const now = new Date();
      const daysUntil = Math.ceil((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil === 0) return 'Today';
      if (daysUntil === 1) return 'Tomorrow';
      if (daysUntil < 7) return `${daysUntil} days`;
      
      return matchDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    case 'POSTPONED':
      return 'Postponed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return '';
  }
}

/**
 * Check if Barcelona is playing at home
 */
export function isBarcelonaHome(match: FootballMatch): boolean {
  return match.homeTeam.id === BARCELONA_TEAM_ID;
}

/**
 * Get opponent team
 */
export function getOpponent(match: FootballMatch): FootballMatch['homeTeam'] | FootballMatch['awayTeam'] {
  return isBarcelonaHome(match) ? match.awayTeam : match.homeTeam;
}
