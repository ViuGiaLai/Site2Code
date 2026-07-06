import { IsUrl } from 'class-validator';

export class CrawlDto {
  @IsUrl({ require_tld: false })
  url!: string;
}
