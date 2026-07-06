import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrawlerService } from '../crawler/crawler.service';
import { AnalyzerService } from '../analyzer/analyzer.service';
import { GeneratorService } from '../generator/generator.service';
import { ReviewerService } from '../reviewer/reviewer.service';
import { ExportService } from '../export/export.service';

@Injectable()
export class PipelineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crawler: CrawlerService,
    private readonly analyzer: AnalyzerService,
    private readonly generator: GeneratorService,
    private readonly reviewer: ReviewerService,
    private readonly exportService: ExportService,
  ) {}

  async startJob(url: string, stack: { frontend: string; css: string; backend?: string; database?: string }) {
    const job = await this.prisma.job.create({
      data: { url, ...stack, status: 'crawling', progress: 0 },
    });

    this.runPipeline(job.id).catch((err) =>
      this.prisma.job.update({ where: { id: job.id }, data: { status: 'failed', error: err.message } }),
    );

    return { jobId: job.id, status: 'crawling' };
  }

  private async runPipeline(jobId: string) {
    const job = await this.prisma.job.findUniqueOrThrow({ where: { id: jobId } });

    await this.updateJob(jobId, 'crawling', 10);
    const crawlResult = await this.crawler.crawl(job.url);

    await this.updateJob(jobId, 'analyzing', 25);
    const layout = await this.analyzer.analyze(crawlResult.html);
    await this.prisma.job.update({ where: { id: jobId }, data: { layout: JSON.stringify(layout) } });

    await this.updateJob(jobId, 'generating', 45);
    const stack = { frontend: job.frontend, css: job.css, backend: job.backend ?? undefined, database: job.database ?? undefined };
    const genResult = await this.generator.generate(layout, stack);
    const files = genResult.files as { path: string; content: string; language: string }[];

    await this.updateJob(jobId, 'reviewing', 65);
    const reviewReport = await this.reviewer.review(files);
    await this.prisma.job.update({ where: { id: jobId }, data: { report: JSON.stringify(reviewReport) } });

    await this.updateJob(jobId, 'optimizing', 80);
    const optimized = await this.reviewer.optimize(files, reviewReport as Record<string, unknown>);
    const optimizedFiles = optimized.files as { path: string; content: string; language: string }[];

    await this.updateJob(jobId, 'security', 90);
    const securityReport = await this.reviewer.securityReview(optimizedFiles);

    await this.updateJob(jobId, 'packaging', 95);
    const zipPath = await this.exportService.createZip(jobId, optimizedFiles);

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        progress: 100,
        files: JSON.stringify(optimizedFiles),
        zipPath,
        report: JSON.stringify({ review: reviewReport, security: securityReport }),
      },
    });
  }

  private async updateJob(jobId: string, status: string, progress: number) {
    await this.prisma.job.update({ where: { id: jobId }, data: { status, progress } });
  }
}
