// iTunes Search API - Free, no authentication needed
// Fetches album artwork for music

export interface ITunesResponse {
  resultCount: number;
  results: {
    artistName: string;
    collectionName: string;
    trackName: string;
    artworkUrl100: string;
    artworkUrl60: string;
    previewUrl?: string;
  }[];
}

export async function getAlbumCover(
  songName: string,
  artistName: string
): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${songName} ${artistName}`);
    const response = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`
    );

    if (!response.ok) {
      throw new Error('iTunes API request failed');
    }

    const data: ITunesResponse = await response.json();

    if (data.resultCount > 0 && data.results[0]) {
      // Get high-res artwork (replace 100x100 with 600x600)
      const artworkUrl = data.results[0].artworkUrl100.replace('100x100', '600x600');
      return artworkUrl;
    }

    return null;
  } catch (error) {
    console.error('Error fetching album cover:', error);
    return null;
  }
}

export async function searchMusic(query: string): Promise<ITunesResponse['results']> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=10`
    );

    if (!response.ok) {
      throw new Error('iTunes API request failed');
    }

    const data: ITunesResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
}
