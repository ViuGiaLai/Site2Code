import { Body, Controller, Post } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlDto } from './dto/crawl.dto';
import { validateCrawlUrl } from '../common/utils/url.util';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('crawl')
  async crawl(@Body() dto: CrawlDto) {
    validateCrawlUrl(dto.url, dto.confirmedRights);
    return this.crawlerService.crawl(dto.url);
  }
}
