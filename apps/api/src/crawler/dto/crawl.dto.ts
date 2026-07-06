import { IsString, IsUrl } from 'class-validator';

export class CrawlDto {
  @IsString()
  @IsUrl({ require_tld: false })
  url: string;
}
