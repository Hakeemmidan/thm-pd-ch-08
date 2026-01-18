import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ItunesService } from './itunes.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, ItunesService],
})
export class SearchModule {}
