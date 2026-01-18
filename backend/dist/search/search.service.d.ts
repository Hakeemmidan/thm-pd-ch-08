import { PrismaService } from '../prisma/prisma.service';
import { ItunesService } from './itunes.service';
import { Podcast } from '@prisma/client';
export declare class SearchService {
    private prisma;
    private itunesService;
    constructor(prisma: PrismaService, itunesService: ItunesService);
    search(term: string): Promise<Podcast[]>;
    private upsertPodcast;
}
