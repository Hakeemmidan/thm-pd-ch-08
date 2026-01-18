import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface ITunesPodcast {
  trackId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
  feedUrl?: string;
  trackCount?: number;
  primaryGenreName?: string;
  releaseDate?: string;
}

export interface ITunesEpisode {
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
  kind: 'podcast-episode';
}

interface ITunesSearchResponse<T> {
  resultCount: number;
  results: T[];
}

@Injectable()
export class ItunesService {
  private readonly baseUrl = 'https://itunes.apple.com/search';

  async searchPodcasts(term: string, limit: number = 20): Promise<ITunesPodcast[]> {
    try {
      const response = await axios.get<ITunesSearchResponse<ITunesPodcast>>(this.baseUrl, {
        params: {
          term: term,
          media: 'podcast',
          entity: 'podcast',
          limit: limit,
          country: 'SA',
        },
      });

      return response.data.results;
    } catch (error) {
      console.error('iTunes API error:', error);
      throw new HttpException(
        'Failed to fetch podcasts from iTunes',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async searchEpisodes(term: string, limit: number = 20): Promise<ITunesEpisode[]> {
    try {
      const response = await axios.get<ITunesSearchResponse<ITunesEpisode>>(this.baseUrl, {
        params: {
          term: term,
          media: 'podcast',
          entity: 'podcastEpisode',
          limit: limit,
          country: 'SA',
        },
      });

      return response.data.results;
    } catch (error) {
      console.error('iTunes API error (episodes):', error);
      return []; // Return empty if fails
    }
  }
}
