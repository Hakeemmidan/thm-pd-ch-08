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

    const podcasts = await this.searchService.search(term.trim());

    return {
      success: true,
      count: podcasts.length,
      term: term.trim(),
      results: podcasts,
    };
  }
}
