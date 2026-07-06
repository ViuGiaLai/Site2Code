import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
import { CrawlerModule } from '../crawler/crawler.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';
import { GeneratorModule } from '../generator/generator.module';
import { ReviewerModule } from '../reviewer/reviewer.module';
import { ExportModule } from '../export/export.module';

@Module({
  imports: [CrawlerModule, AnalyzerModule, GeneratorModule, ReviewerModule, ExportModule],
  providers: [PipelineService],
  controllers: [PipelineController],
})
export class PipelineModule {}
