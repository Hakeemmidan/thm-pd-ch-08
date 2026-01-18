import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('term') term: string) {
    if (!term || term.trim().length === 0) {
      throw new HttpException(
        'Search term is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [podcasts, episodes] = await Promise.all([
      this.searchService.search(term.trim()),
      this.searchService.searchEpisodes(term.trim()),
    ]);

    return {
      success: true,
      term: term.trim(),
      podcasts,
      episodes,
    };
  }
}
