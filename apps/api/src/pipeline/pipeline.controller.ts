import { Body, Controller, Get, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { createReadStream, existsSync } from 'fs';

@Controller('api')
export class PipelineController {
  constructor(
    private readonly pipeline: PipelineService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('crawl')
  async crawl(@Body() body: { url: string; frontend: string; css: string; backend?: string; database?: string }) {
    return this.pipeline.startJob(body.url, {
      frontend: body.frontend,
      css: body.css,
      backend: body.backend,
      database: body.database,
    });
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
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
