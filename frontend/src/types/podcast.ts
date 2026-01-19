export interface Podcast {
  id: number;
  trackId: number;
  collectionName: string;
  artistName: string;
  trackName?: string;
  artworkUrl100: string;
  artworkUrl600: string;
  feedUrl: string | null;
  trackCount: number | null;
  primaryGenre: string | null;
  releaseDate: string | null;
  searchTerm: string;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  trackId: number;
  collectionId: number;
  trackName: string;
  collectionName: string;
  artistName: string;
  artworkUrl160?: string;
  artworkUrl600?: string;
  releaseDate: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
  description?: string;
  shortDescription?: string;
}

export interface SearchResponse {
  success: boolean;
  term: string;
  podcasts: Podcast[];
  episodes: Episode[];
}
