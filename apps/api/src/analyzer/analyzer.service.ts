import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AnalyzerService {
  constructor(private readonly ai: AiService) {}

  async analyze(html: string, screenshotB64?: string) {
    const input = `RENDERED_HTML:\n${html.slice(0, 100000)}${screenshotB64 ? `\nSCREENSHOT_B64: ${screenshotB64.slice(0, 5000)}` : ''}`;
    const raw = await this.ai.generateFromPrompt('analyze-layout', input);
    const json = this.extractJson(raw);
    return json;
  }

  private extractJson(text: string): Record<string, unknown> {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in AI response');
    return JSON.parse(match[0]);
  }
}
