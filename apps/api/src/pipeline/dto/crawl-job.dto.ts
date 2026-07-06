import { IsBoolean, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

const FRONTENDS = ['nextjs', 'react', 'vue', 'angular', 'svelte'] as const;
const CSS_OPTIONS = ['tailwind', 'bootstrap', 'material-ui', 'chakra', 'none'] as const;
const BACKENDS = ['nestjs', 'express', 'fastapi', 'springboot'] as const;
const DATABASES = ['postgresql', 'mysql', 'mongodb', 'sqlite'] as const;

export class CrawlJobDto {
  @IsUrl({ require_tld: false })
  url!: string;

  @IsBoolean()
  confirmedRights!: boolean;

  @IsIn(FRONTENDS)
  frontend!: string;

  @IsIn(CSS_OPTIONS)
  css!: string;

  @IsOptional()
  @IsIn(BACKENDS)
  backend?: string;

  @IsOptional()
  @IsIn(DATABASES)
  database?: string;
}
