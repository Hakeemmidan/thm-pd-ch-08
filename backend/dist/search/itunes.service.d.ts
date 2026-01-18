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
export declare class ItunesService {
    private readonly baseUrl;
    searchPodcasts(term: string, limit?: number): Promise<ITunesPodcast[]>;
    searchEpisodes(term: string, limit?: number): Promise<ITunesEpisode[]>;
}
