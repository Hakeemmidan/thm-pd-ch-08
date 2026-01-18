export interface Podcast {
  id: number;
  trackId: number;
  collectionName: string;
  artistName: string;
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

export interface SearchResponse {
  success: boolean;
  count: number;
  term: string;
  results: Podcast[];
}
