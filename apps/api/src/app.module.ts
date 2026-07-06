import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { PipelineModule } from './pipeline/pipeline.module';

@Module({
  imports: [CrawlerModule, PrismaModule, AiModule, PipelineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
