import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(term: string): Promise<{
        success: boolean;
        count: number;
        term: string;
        results: {
            id: number;
            trackId: number;
            collectionName: string;
            artistName: string;
            artworkUrl100: string;
            artworkUrl600: string;
            feedUrl: string | null;
            trackCount: number | null;
            primaryGenre: string | null;
            releaseDate: Date | null;
            searchTerm: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
}
