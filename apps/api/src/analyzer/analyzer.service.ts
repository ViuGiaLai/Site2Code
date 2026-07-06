import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { extractJsonObject } from '../common/utils/json.util';
import { compressHtmlForAnalysis } from '../common/utils/ai-payload.util';

@Injectable()
export class AnalyzerService {
  constructor(private readonly ai: AiService) {}

  async analyze(
    url: string,
    html: string,
    stack: { frontend: string; css: string; backend?: string; database?: string },
    meta?: { title?: string | null; metaDescription?: string | null },
  ) {
    const input = [
      `SOURCE_URL: ${url}`,
      meta?.title ? `PAGE_TITLE: ${meta.title}` : '',
      meta?.metaDescription ? `META_DESCRIPTION: ${meta.metaDescription}` : '',
      `RENDERED_HTML:\n${compressHtmlForAnalysis(html)}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const raw = await this.ai.generateFromPrompt('analyze-layout', input, {
      stage: 'analyze',
      stack,
    });
    return extractJsonObject(raw);
  }
}
