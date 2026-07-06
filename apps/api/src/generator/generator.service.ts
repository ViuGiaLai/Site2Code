import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class GeneratorService {
  constructor(private readonly ai: AiService) {}

  async generate(layoutJson: Record<string, unknown>, stack: { frontend: string; css: string; backend?: string; database?: string }) {
    const input = JSON.stringify({ layout: layoutJson, stack }, null, 2);
    const raw = await this.ai.generateFromPrompt('generate-code', input);
    const files = this.extractJson(raw);
    return { files: (files as { files: unknown[] }).files ?? files };
  }

  private extractJson(text: string): Record<string, unknown> {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found in AI response');
    return { files: JSON.parse(match[0]) };
  }
}
