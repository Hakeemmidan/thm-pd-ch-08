"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const itunes_service_1 = require("./itunes.service");
let SearchService = class SearchService {
    constructor(prisma, itunesService) {
        this.prisma = prisma;
        this.itunesService = itunesService;
    }
    async search(term) {
        const itunesPodcasts = await this.itunesService.searchPodcasts(term);
        const podcasts = await Promise.all(itunesPodcasts.map((podcast) => this.upsertPodcast(podcast, term)));
        return podcasts;
    }
    async searchEpisodes(term) {
        return this.itunesService.searchEpisodes(term);
    }
    async upsertPodcast(iTunesPodcast, searchTerm) {
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        itunes_service_1.ItunesService])
], SearchService);
//# sourceMappingURL=search.service.js.map