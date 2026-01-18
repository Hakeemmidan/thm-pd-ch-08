"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItunesService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let ItunesService = class ItunesService {
    constructor() {
        this.baseUrl = 'https://itunes.apple.com/search';
    }
    async searchPodcasts(term, limit = 20) {
        try {
            const response = await axios_1.default.get(this.baseUrl, {
                params: {
                    term: term,
                    media: 'podcast',
                    entity: 'podcast',
                    limit: limit,
                    country: 'SA',
                },
            });
            return response.data.results;
        }
        catch (error) {
            console.error('iTunes API error:', error);
            throw new common_1.HttpException('Failed to fetch podcasts from iTunes', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async searchEpisodes(term, limit = 20) {
        try {
            const response = await axios_1.default.get(this.baseUrl, {
                params: {
                    term: term,
                    media: 'podcast',
                    entity: 'podcastEpisode',
                    limit: limit,
                    country: 'SA',
                },
            });
            return response.data.results;
        }
        catch (error) {
            console.error('iTunes API error (episodes):', error);
            return [];
        }
    }
};
exports.ItunesService = ItunesService;
exports.ItunesService = ItunesService = __decorate([
    (0, common_1.Injectable)()
], ItunesService);
//# sourceMappingURL=itunes.service.js.map