import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AiProvider } from './providers/ai-provider.interface';
import { SkillLoaderService, JobStack, PipelineStage } from './skill-loader.service';
import { PROMPT_STAGE, resolveProviderChain, ProviderId } from './ai-stage.config';
import { createProvider, listConfiguredProviders } from './ai-provider.factory';
import { OpenAiCompatibleProvider } from './providers/openai-compatible.provider';
import { resolveMonorepoPath } from '../common/config/load-env';

const PIPELINE_STAGES: PipelineStage[] = ['analyze', 'generate', 'review', 'optimize', 'security'];

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private readonly promptsDir = resolveMonorepoPath('ai', 'prompts');
  private readonly promptCache = new Map<string, string>();

  constructor(private readonly skillLoader: SkillLoaderService) {}

  onModuleInit() {
    const mode = process.env.LLM_MODE || 'cloud';

    if (mode === 'local' && !process.env.LLAMA_SERVER_URL) {
      throw new Error('LLM_MODE=local requires LLAMA_SERVER_URL');
    }

    const configured = listConfiguredProviders();
    if (configured.length === 0 && mode !== 'local') {
      throw new Error(
        'No AI provider configured. Set at least one free-tier API key in root .env (GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, ...).',
      );
    }

    this.logger.log(`AI providers ready: ${configured.join(', ') || 'local only'}`);
    for (const stage of PIPELINE_STAGES) {
      const chain = resolveProviderChain(stage);
      const available = chain.filter((id) => createProvider(id));
      this.logger.log(`  ${stage}: ${available.join(' → ') || '(none)'}`);

      const override = process.env[`AI_${stage.toUpperCase()}_PROVIDER`]?.trim().toLowerCase();
      if (override && !createProvider(override as ProviderId)) {
        this.logger.warn(
          `  ${stage}: AI_${stage.toUpperCase()}_PROVIDER=${override} has no API key — using fallback chain`,
        );
      }
    }
  }

  private getLocalProvider(): AiProvider {
    const base = process.env.LLAMA_SERVER_URL || 'http://127.0.0.1:8080/v1';
    const apiKey = process.env.LOCAL_API_KEY || 'not-needed';
    return new OpenAiCompatibleProvider(
      'local',
      process.env.LOCAL_API_KEY || 'not-needed',
      process.env.LOCAL_MODEL || 'default',
      base.replace(/\/v1\/?$/, '/v1'),
    );
  }

  loadPrompt(name: string): string {
    const cached = this.promptCache.get(name);
    if (cached) return cached;
    const content = readFileSync(join(this.promptsDir, `${name}.md`), 'utf-8');
    this.promptCache.set(name, content);
    return content;
  }

  async generateFromPrompt(
    promptName: string,
    input: string,
    options?: { stage?: PipelineStage; stack?: JobStack },
  ): Promise<string> {
    const stage = options?.stage ?? PROMPT_STAGE[promptName];
    if (!stage) throw new Error(`Unknown prompt stage for: ${promptName}`);

    const prompt = this.loadPrompt(promptName);
    const skills = this.skillLoader.loadForStage(stage, options?.stack);
    let systemPrompt = skills
      ? `${prompt}\n\n---\n## Relevant Skills (follow these conventions)\n\n${skills}`
      : prompt;

    if (['generate', 'review', 'optimize', 'security'].includes(stage)) {
      systemPrompt +=
        '\n\n---\n**OUTPUT RULE:** Return valid JSON only. No markdown fences, no explanation text before or after.';
    }

    const mode = process.env.LLM_MODE || 'cloud';
    const chain: ProviderId[] =
      mode === 'local' ? [] : resolveProviderChain(stage);
    const maxRetries = Number(process.env.AI_MAX_RETRIES || 2);
    let lastError: Error | undefined;

    const providers: AiProvider[] =
      mode === 'local' ? [this.getLocalProvider()] : this.buildProviderList(chain);

    if (providers.length === 0) {
      throw new Error(`No provider available for stage: ${stage}`);
    }

    for (const provider of providers) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          this.logger.log(`${promptName} → ${provider.name} (attempt ${attempt + 1})`);
          const result = await provider.generate(input, systemPrompt);
          if (!result.trim()) throw new Error('Empty AI response');
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const errorMessage = lastError.message;
          this.logger.warn(`${provider.name} failed: ${errorMessage}`);
          if (this.isNonRetryableError(errorMessage)) break;
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, this.getRetryDelayMs(errorMessage, attempt)));
          }
        }
      }
    }

    throw lastError ?? new Error('AI generation failed');
  }

  /** Auth, model-not-found, and similar errors should fail over immediately. */
  private isNonRetryableError(message: string): boolean {
    return /(?:\b401\b|\b403\b|\b404\b|\b413\b|authentication|invalid api key|model_not_found|does not exist|request too large|tokens per minute)/i.test(
      message,
    );
  }

  private getRetryDelayMs(message: string, attempt: number): number {
    const retryAfter =
      message.match(/retry_after_seconds[^0-9]*(\d+)/i)?.[1] ??
      message.match(/"Retry-After"\s*:\s*"?(\d+)/i)?.[1];
    if (retryAfter) return Number(retryAfter) * 1000;
    return 1000 * (attempt + 1);
  }

  private buildProviderList(chain: ProviderId[]): AiProvider[] {
    const list: AiProvider[] = [];
    for (const id of chain) {
      const p = createProvider(id);
      if (p) list.push(p);
    }
    return list;
  }
}
