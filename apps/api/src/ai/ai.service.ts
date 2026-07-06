import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AiProvider } from './providers/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { OpenRouterProvider } from './providers/openrouter.provider';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private provider!: AiProvider;
  private readonly promptsDir = this.resolvePromptsDir();

  private resolvePromptsDir(): string {
    const candidates = [
      join(__dirname, '..', '..', '..', '..', 'ai', 'prompts'),
      join(process.cwd(), 'ai', 'prompts'),
      join(process.cwd(), '..', '..', 'ai', 'prompts'),
    ];
    for (const dir of candidates) {
      if (existsSync(dir)) return dir;
    }
    return candidates[0];
  }

  onModuleInit() {
    const mode = process.env.LLM_MODE || 'cloud';
    const defaultProvider = process.env.DEFAULT_PROVIDER || 'gemini';

    if (mode === 'local') {
      throw new Error('Local LLM not implemented yet');
    }

    if (defaultProvider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
      this.provider = new OpenRouterProvider(
        process.env.OPENROUTER_API_KEY!,
        process.env.OPENROUTER_MODEL || 'qwen/qwen3-coder:free',
        process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      );
    } else if (process.env.GEMINI_API_KEY) {
      this.provider = new GeminiProvider(
        process.env.GEMINI_API_KEY!,
        process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      );
    } else {
      throw new Error('No AI provider configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY.');
    }
  }

  loadPrompt(name: string): string {
    return readFileSync(join(this.promptsDir, `${name}.md`), 'utf-8');
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    return this.provider.generate(prompt, systemPrompt);
  }

  async generateFromPrompt(promptName: string, input: string): Promise<string> {
    const prompt = this.loadPrompt(promptName);
    return this.provider.generate(input, prompt);
  }
}
