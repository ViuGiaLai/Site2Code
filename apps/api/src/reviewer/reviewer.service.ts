import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ReviewerService {
  constructor(
    private readonly ai: AiService,
  ) {}

  async review(files: { path: string; content: string; language: string }[]) {
    const input = JSON.stringify(files, null, 2);
    const raw = await this.ai.generateFromPrompt('review-code', input);
    const report = this.extractJson(raw);
    return report;
  }

  async optimize(files: { path: string; content: string; language: string }[], reviewReport: Record<string, unknown>) {
    const input = JSON.stringify({ files, reviewReport }, null, 2);
    const raw = await this.ai.generateFromPrompt('optimize-code', input);
    const optimized = this.extractFileList(raw);
    return optimized;
  }

  async securityReview(files: { path: string; content: string; language: string }[]) {
    const input = JSON.stringify(files, null, 2);
    const raw = await this.ai.generateFromPrompt('security-review', input);
    const report = this.extractJson(raw);
    return report;
  }

  private extractJson(text: string): Record<string, unknown> {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in AI response');
    return JSON.parse(match[0]);
  }

  private extractFileList(text: string): { files: { path: string; content: string; language: string }[] } {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found in AI response');
    return { files: JSON.parse(match[0]) };
  }
}
