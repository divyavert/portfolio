import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';
const BARCELONA_TEAM_ID = 81;

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Football API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/teams/${BARCELONA_TEAM_ID}/matches?status=SCHEDULED,IN_PLAY,FINISHED&limit=20`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`);
    }

    const data = await response.json();
    const matches = data.matches;

    // Find live match
    const liveMatch = matches.find(
      (match: any) => match.status === 'IN_PLAY' || match.status === 'PAUSED'
    ) || null;

    // Find next scheduled match
    const now = new Date();
    const upcomingMatches = matches.filter(
      (match: any) =>
        (match.status === 'SCHEDULED' || match.status === 'TIMED') &&
        new Date(match.utcDate) > now
    );
    const nextMatch = upcomingMatches.sort(
      (a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    )[0] || null;

    // Find last finished match
    const finishedMatches = matches.filter(
      (match: any) => match.status === 'FINISHED' && new Date(match.utcDate) < now
    );
    const lastMatch = finishedMatches.sort(
      (a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
    )[0] || null;

    return NextResponse.json({
      liveMatch,
      nextMatch,
      lastMatch,
    });
  } catch (error) {
    console.error('Error fetching Barcelona matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match data' },
      { status: 500 }
    );
  }
}
