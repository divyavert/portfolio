// TMDB (The Movie Database) API
// Free API for movie and TV show posters
// Requires API key from https://www.themoviedb.org/settings/api

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Get poster URL with different sizes
// Sizes: w92, w154, w185, w342, w500, w780, original
export function getPosterUrl(posterPath: string | null, size: string = 'w500'): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

// Search for movies
export async function searchMovie(query: string): Promise<TMDBMovie[]> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data: TMDBSearchResponse<TMDBMovie> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

// Search for TV shows
export async function searchTVShow(query: string): Promise<TMDBTVShow[]> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured');
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodedQuery}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data: TMDBSearchResponse<TMDBTVShow> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return [];
  }
}

// Get movie/show poster by title (auto-detects type)
export async function getMoviePoster(
  title: string,
  type: 'movie' | 'show' = 'movie'
): Promise<string | null> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured. Add NEXT_PUBLIC_TMDB_API_KEY to .env.local');
    return null;
  }

  try {
    const results = type === 'movie' 
      ? await searchMovie(title)
      : await searchTVShow(title);

    if (results.length > 0 && results[0].poster_path) {
      return getPosterUrl(results[0].poster_path, 'w500');
    }

    return null;
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return null;
  }
}

// Get high-res poster
export async function getMoviePosterHD(
  title: string,
  type: 'movie' | 'show' = 'movie'
): Promise<string | null> {
  if (!TMDB_API_KEY) {
    return null;
  }

  try {
    const results = type === 'movie' 
      ? await searchMovie(title)
      : await searchTVShow(title);

    if (results.length > 0 && results[0].poster_path) {
      return getPosterUrl(results[0].poster_path, 'original');
    }

    return null;
  } catch (error) {
    console.error('Error fetching HD movie poster:', error);
    return null;
  }
}
