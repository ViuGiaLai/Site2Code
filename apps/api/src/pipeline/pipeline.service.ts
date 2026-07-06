import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrawlerService } from '../crawler/crawler.service';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { GeneratorService } from '../generator/generator.service';
import type { GeneratedFile } from '../generator/generator.service';
import { ReviewerService } from '../reviewer/reviewer.service';
import { ExportService } from '../export/export.service';
import { validateCrawlUrl } from '../common/utils/url.util';

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly crawler: CrawlerService,
    private readonly analyzer: AnalyzerService,
    private readonly generator: GeneratorService,
    private readonly reviewer: ReviewerService,
    private readonly exportService: ExportService,
  ) {}

  async startJob(
    url: string,
    stack: { frontend: string; css: string; backend?: string; database?: string },
    confirmedRights: boolean,
  ) {
    validateCrawlUrl(url, confirmedRights);

    const job = await this.prisma.job.create({
      data: { url, ...stack, status: 'crawling', progress: 0 },
    });

    this.runPipeline(job.id).catch((err) => this.failJob(job.id, err));

    return { jobId: job.id, status: 'crawling' };
  }

  private async failJob(jobId: string, err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    this.logger.error(`Pipeline ${jobId} failed: ${message}`);
    try {
      await this.prisma.job.update({
        where: { id: jobId },
        data: { status: 'failed', error: message },
      });
    } catch (updateErr) {
      this.logger.error(`Failed to update job ${jobId} status`, updateErr);
    }
  }

  private async runPipeline(jobId: string) {
    const started = Date.now();
    const timings: Record<string, number> = {};

    const job = await this.prisma.job.findUniqueOrThrow({ where: { id: jobId } });
    const stack = {
      frontend: job.frontend,
      css: job.css,
      backend: job.backend ?? undefined,
      database: job.database ?? undefined,
    };

    let stepStart = Date.now();
    await this.updateJob(jobId, 'crawling', 10);
    const crawlResult = await this.crawler.crawl(job.url);
    timings.crawl = Date.now() - stepStart;

    stepStart = Date.now();
    await this.updateJob(jobId, 'analyzing', 25);
    const layout = await this.analyzer.analyze(job.url, crawlResult.html, stack, {
      title: crawlResult.title,
      metaDescription: crawlResult.metaDescription,
    });
    timings.analyze = Date.now() - stepStart;
    await this.prisma.job.update({ where: { id: jobId }, data: { layout: JSON.stringify(layout) } });

    stepStart = Date.now();
    await this.updateJob(jobId, 'generating', 45);
    const genResult = await this.generator.generate(layout, stack);
    const files = genResult.files as GeneratedFile[];
    timings.generate = Date.now() - stepStart;
    if (files.length === 0) {
      throw new Error('Code generation returned no files');
    }

    stepStart = Date.now();
    await this.updateJob(jobId, 'reviewing', 65);
    const reviewReport = await this.reviewer.review(files, stack, layout);
    timings.review = Date.now() - stepStart;

    const fastMode = process.env.AI_PIPELINE_FAST === 'true';
    let finalFiles: GeneratedFile[];

    if (fastMode) {
      this.logger.log(`Job ${jobId}: fast mode — skipping optimize step`);
      finalFiles = files;
    } else {
      stepStart = Date.now();
      await this.updateJob(jobId, 'optimizing', 80);
      const optimized = await this.reviewer.optimize(files, reviewReport, stack);
      finalFiles = optimized.files as GeneratedFile[];
      timings.optimize = Date.now() - stepStart;
      if (finalFiles.length === 0) {
        throw new Error('Optimization returned no files');
      }
    }

    stepStart = Date.now();
    await this.updateJob(jobId, 'security', fastMode ? 85 : 90);
    const securityReport = await this.reviewer.securityReview(finalFiles, stack);
    finalFiles = this.applySecurityFixes(finalFiles, securityReport);
    timings.security = Date.now() - stepStart;

    stepStart = Date.now();
    await this.updateJob(jobId, 'packaging', 95);
    const zipPath = await this.exportService.createZip(jobId, finalFiles);
    timings.packaging = Date.now() - stepStart;

    const fileSummary = finalFiles.map((f) => ({
      path: f.path,
      language: f.language,
      bytes: f.content.length,
    }));

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        files: JSON.stringify(fileSummary),
        zipPath,
        report: JSON.stringify({ review: reviewReport, security: securityReport, timings }),
      },
    });

    const totalSec = ((Date.now() - started) / 1000).toFixed(1);
    this.logger.log(
      `Job ${jobId} completed in ${totalSec}s — crawl:${timings.crawl}ms analyze:${timings.analyze}ms generate:${timings.generate}ms review:${timings.review}ms${timings.optimize ? ` optimize:${timings.optimize}ms` : ''} security:${timings.security}ms zip:${timings.packaging}ms`,
    );
  }

  private applySecurityFixes(
    files: GeneratedFile[],
    securityReport: Record<string, unknown>,
  ): GeneratedFile[] {
    const fixed = securityReport.fixedFiles;
    if (!Array.isArray(fixed) || fixed.length === 0) return files;

    const map = new Map(files.map((f) => [f.path, f]));
    for (const item of fixed) {
      const row = item as { path?: string; content?: string; language?: string };
      if (!row.path || row.content == null) continue;
      map.set(row.path, {
        path: row.path,
        content: row.content,
        language: row.language ?? map.get(row.path)?.language ?? 'text',
      });
    }
    return [...map.values()];
  }

  private async updateJob(jobId: string, status: string, progress: number) {
    await this.prisma.job.update({ where: { id: jobId }, data: { status, progress } });
  }
}
