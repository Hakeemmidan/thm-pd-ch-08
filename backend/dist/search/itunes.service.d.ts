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
export declare class ItunesService {
    private readonly baseUrl;
    searchPodcasts(term: string, limit?: number): Promise<ITunesPodcast[]>;
}
