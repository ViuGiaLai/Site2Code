import { Body, Controller, Get, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PrismaService } from '../prisma/prisma.service';
import { CrawlJobDto } from './dto/crawl-job.dto';
import type { Response } from 'express';
import { createReadStream, existsSync } from 'fs';

@Controller('api')
export class PipelineController {
  constructor(
    private readonly pipeline: PipelineService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('crawl')
  async crawl(@Body() body: CrawlJobDto) {
    return this.pipeline.startJob(
      body.url,
      {
        frontend: body.frontend,
        css: body.css,
        backend: body.backend,
        database: body.database,
      },
      body.confirmedRights,
    );
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return {
      ...job,
      downloadUrl: job.status === 'completed' ? `/api/export/${id}` : null,
    };
  }

  @Get('export/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job || !job.zipPath || !existsSync(job.zipPath)) {
      throw new NotFoundException('Export not found');
    }
    const file = createReadStream(job.zipPath);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="project-${id}.zip"`,
    });
    file.pipe(res);
  }
}
