import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { extractJsonArray, extractJsonObject } from '../common/utils/json.util';
import { trimFilesForAi } from '../common/utils/ai-payload.util';
import type { GeneratedFile } from '../generator/generator.service';

@Injectable()
export class ReviewerService {
  constructor(private readonly ai: AiService) {}

  async review(
    files: GeneratedFile[],
    stack: { frontend: string; css: string; backend?: string; database?: string },
    layout?: Record<string, unknown>,
  ) {
    const input = JSON.stringify({ files: trimFilesForAi(files), stack, layout }, null, 2);
    const raw = await this.ai.generateFromPrompt('review-code', input, {
      stage: 'review',
      stack,
    });
    return extractJsonObject(raw);
  }

  async optimize(
    files: GeneratedFile[],
    reviewReport: Record<string, unknown>,
    stack: { frontend: string; css: string; backend?: string; database?: string },
  ) {
    const input = JSON.stringify(
      { files: trimFilesForAi(files), reviewReport, stack },
      null,
      2,
    );
    const raw = await this.ai.generateFromPrompt('optimize-code', input, {
      stage: 'optimize',
      stack,
    });

    try {
      const optimized = extractJsonArray<GeneratedFile>(raw);
      if (optimized.length === 0) throw new Error('Empty optimized file list');
      return { files: optimized };
    } catch {
      const parsed = extractJsonObject(raw);
      if (Array.isArray(parsed.files) && parsed.files.length > 0) {
        return { files: parsed.files as GeneratedFile[] };
      }
      throw new Error('No optimized file list found in AI response');
    }
  }

  async securityReview(
    files: GeneratedFile[],
    stack: { frontend: string; css: string; backend?: string; database?: string },
  ) {
    const input = JSON.stringify({ files: trimFilesForAi(files), stack }, null, 2);
    const raw = await this.ai.generateFromPrompt('security-review', input, {
      stage: 'security',
      stack,
    });
    return extractJsonObject(raw);
  }
}
