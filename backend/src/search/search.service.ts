import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItunesService, ITunesPodcast, ITunesEpisode } from './itunes.service';
import { Podcast } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private itunesService: ItunesService,
  ) {}

  async search(term: string): Promise<Podcast[]> {
    const itunesPodcasts = await this.itunesService.searchPodcasts(term);

    const podcasts = await Promise.all(
      itunesPodcasts.map((podcast) => this.upsertPodcast(podcast, term)),
    );

    return podcasts;
  }

  async searchEpisodes(term: string): Promise<ITunesEpisode[]> {
    return this.itunesService.searchEpisodes(term);
  }

  private async upsertPodcast(
    iTunesPodcast: ITunesPodcast,
    searchTerm: string,
  ): Promise<Podcast> {
    const podcastData = {
      trackId: iTunesPodcast.trackId,
      collectionName: iTunesPodcast.collectionName,
      artistName: iTunesPodcast.artistName,
      artworkUrl100: iTunesPodcast.artworkUrl100,
      artworkUrl600: iTunesPodcast.artworkUrl600,
      feedUrl: iTunesPodcast.feedUrl || null,
      trackCount: iTunesPodcast.trackCount || null,
      primaryGenre: iTunesPodcast.primaryGenreName || null,
      releaseDate: iTunesPodcast.releaseDate
        ? new Date(iTunesPodcast.releaseDate)
        : null,
      searchTerm: searchTerm,
    };

    return this.prisma.podcast.upsert({
      where: { trackId: iTunesPodcast.trackId },
      update: {
        ...podcastData,
        updatedAt: new Date(),
      },
      create: podcastData,
    });
  }
}
