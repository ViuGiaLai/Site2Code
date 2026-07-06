import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { extractJsonArray, extractJsonObject } from '../common/utils/json.util';

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

@Injectable()
export class GeneratorService {
  constructor(private readonly ai: AiService) {}

  async generate(
    layoutJson: Record<string, unknown>,
    stack: { frontend: string; css: string; backend?: string; database?: string },
  ) {
    const input = JSON.stringify({ layout: layoutJson, stack }, null, 2);
    const raw = await this.ai.generateFromPrompt('generate-code', input, {
      stage: 'generate',
      stack,
    });

    try {
      const files = extractJsonArray<GeneratedFile>(raw);
      if (files.length === 0) throw new Error('Empty file list in AI response');
      return { files };
    } catch (parseErr) {
      try {
        const parsed = extractJsonObject(raw);
        const files = parsed.files;
        if (Array.isArray(files) && files.length > 0) {
          return { files: files as GeneratedFile[] };
        }
      } catch {
        /* fall through */
      }
      const preview = raw.slice(0, 120).replace(/\s+/g, ' ');
      throw new Error(
        `No file list found in AI response (${preview}${raw.length > 120 ? '…' : ''})`,
      );
    }
  }
}
