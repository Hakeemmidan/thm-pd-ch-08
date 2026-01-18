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

interface ITunesSearchResponse {
  resultCount: number;
  results: ITunesPodcast[];
}

@Injectable()
export class ItunesService {
  private readonly baseUrl = 'https://itunes.apple.com/search';

  async searchPodcasts(term: string, limit: number = 20): Promise<ITunesPodcast[]> {
    try {
      const response = await axios.get<ITunesSearchResponse>(this.baseUrl, {
        params: {
          term: term,
          media: 'podcast',
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
}
