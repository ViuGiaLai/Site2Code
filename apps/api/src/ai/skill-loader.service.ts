import { Injectable, Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { resolveMonorepoPath } from '../common/config/load-env';

export type PipelineStage = 'analyze' | 'generate' | 'review' | 'optimize' | 'security';

export interface JobStack {
  frontend: string;
  css: string;
  backend?: string;
  database?: string;
}

const STAGE_CHAR_LIMIT: Partial<Record<PipelineStage, string>> = {
  analyze: 'SKILLS_MAX_CHARS_ANALYZE',
  generate: 'SKILLS_MAX_CHARS_GENERATE',
  review: 'SKILLS_MAX_CHARS_REVIEW',
  optimize: 'SKILLS_MAX_CHARS_OPTIMIZE',
  security: 'SKILLS_MAX_CHARS_SECURITY',
};

@Injectable()
export class SkillLoaderService {
  private readonly logger = new Logger(SkillLoaderService.name);
  private readonly skillsDir = resolveMonorepoPath('ai', 'skills');
  private readonly defaultMaxChars = Number(process.env.SKILLS_MAX_CHARS || 32_000);
  private readonly cache = new Map<string, string>();

  resolvePaths(stage: PipelineStage, stack?: JobStack): string[] {
    const paths = new Set<string>();
    const add = (rel: string) => paths.add(rel);

    if (stage === 'analyze') {
      [
        'crawler/playwright.md',
        'crawler/cheerio.md',
        'website-analysis/html.md',
        'website-analysis/css.md',
        'website-analysis/dom.md',
        'website-analysis/accessibility.md',
        'website-analysis/responsive-design.md',
        'website-analysis/seo.md',
        'common/software-architecture.md',
      ].forEach(add);
    }

    if (stage === 'generate' && stack) {
      [
        'common/typescript-pro.md',
        'common/clean-code.md',
        'common/software-architecture.md',
        'ai-codegen/code-generation.md',
        'ai-codegen/structured-output.md',
      ].forEach(add);

      add(`frontend/${stack.frontend}.md`);
      const cssSkill = CSS_SKILL[stack.css];
      if (cssSkill) add(cssSkill);
      if (stack.backend) {
        const backendSkill = BACKEND_SKILL[stack.backend];
        if (backendSkill) add(backendSkill);
      }
      if (stack.database) {
        const dbSkill = DB_SKILL[stack.database];
        if (dbSkill) add(dbSkill);
        if (['postgresql', 'mysql', 'sqlite'].includes(stack.database)) {
          add('database/prisma.md');
        }
      }
    }

    if (stage === 'review') {
      ['common/code-review.md', 'review/code-review.md', 'review/accessibility.md'].forEach(add);
    }

    if (stage === 'optimize') {
      ['review/performance.md', 'review/optimization.md'].forEach(add);
    }

    if (stage === 'security') {
      add('review/security.md');
    }

    return [...paths];
  }

  loadForStage(stage: PipelineStage, stack?: JobStack): string {
    const cacheKey = `${stage}:${stack?.frontend ?? ''}:${stack?.css ?? ''}:${stack?.backend ?? ''}:${stack?.database ?? ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const envKey = STAGE_CHAR_LIMIT[stage];
    const maxChars =
      envKey && process.env[envKey] ? Number(process.env[envKey]) : this.defaultMaxChars;

    const paths = this.resolvePaths(stage, stack);
    const parts: string[] = [];
    let total = 0;

    for (const rel of paths) {
      const full = join(this.skillsDir, rel);
      if (!existsSync(full)) {
        this.logger.warn(`Skill not found: ${rel}`);
        continue;
      }
      const content = readFileSync(full, 'utf-8');
      const chunk = `### Skill: ${rel}\n\n${content}`;
      if (total + chunk.length > maxChars) {
        const remaining = maxChars - total;
        if (remaining > 500) parts.push(chunk.slice(0, remaining) + '\n\n...(truncated)');
        break;
      }
      parts.push(chunk);
      total += chunk.length;
    }

    const result = parts.join('\n\n---\n\n');
    this.cache.set(cacheKey, result);
    return result;
  }
}

const CSS_SKILL: Record<string, string> = {
  tailwind: 'frontend/tailwind.md',
  bootstrap: 'frontend/bootstrap.md',
  'material-ui': 'frontend/material-ui.md',
  chakra: 'frontend/chakra.md',
};

const DB_SKILL: Record<string, string> = {
  postgresql: 'database/postgres.md',
  mysql: 'database/mysql.md',
  mongodb: 'database/mongodb.md',
  sqlite: 'database/sqlite.md',
};

const BACKEND_SKILL: Record<string, string> = {
  nestjs: 'backend/nestjs.md',
  express: 'backend/express.md',
  fastapi: 'backend/fastapi.md',
  springboot: 'backend/springboot.md',
  django: 'backend/django.md',
  laravel: 'backend/laravel.md',
  aspnet: 'backend/aspnet.md',
  go: 'backend/go.md',
  nodejs: 'backend/nodejs.md',
};
