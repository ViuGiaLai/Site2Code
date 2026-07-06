import { Global, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { SkillLoaderService } from './skill-loader.service';

@Global()
@Module({
  providers: [AiService, SkillLoaderService],
  exports: [AiService, SkillLoaderService],
})
export class AiModule {}
