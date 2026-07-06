import { PipelineStage } from './skill-loader.service';

export type ProviderId =
  | 'gemini'
  | 'claude'
  | 'deepseek'
  | 'github'
  | 'openrouter'
  | 'nvidia'
  | 'nvidia-deepseek'
  | 'groq'
  | 'cerebras'
  | 'cohere'
  | 'cloudflare'
  | 'freemodel';

/** Free-tier providers only — fast models first */
export const STAGE_PROVIDER_CHAIN: Record<PipelineStage, ProviderId[]> = {
  analyze: ['gemini', 'groq', 'cerebras', 'openrouter', 'github', 'cloudflare', 'nvidia'],
  generate: ['groq', 'cerebras', 'gemini', 'openrouter', 'github', 'cloudflare', 'nvidia-deepseek', 'nvidia', 'freemodel'],
  review: ['gemini', 'groq', 'openrouter', 'github', 'cloudflare'],
  optimize: ['cerebras', 'groq', 'gemini', 'openrouter', 'github', 'cloudflare'],
  security: ['gemini', 'groq', 'openrouter', 'github', 'cloudflare'],
};

const STAGE_ENV_KEY: Record<PipelineStage, string> = {
  analyze: 'AI_ANALYZE_PROVIDER',
  generate: 'AI_GENERATE_PROVIDER',
  review: 'AI_REVIEW_PROVIDER',
  optimize: 'AI_OPTIMIZE_PROVIDER',
  security: 'AI_SECURITY_PROVIDER',
};

export function resolveProviderChain(stage: PipelineStage): ProviderId[] {
  const override = process.env[STAGE_ENV_KEY[stage]]?.trim().toLowerCase() as ProviderId | undefined;
  const chain = STAGE_PROVIDER_CHAIN[stage];
  if (override) {
    return [override, ...chain.filter((p) => p !== override)];
  }
  return chain;
}

export const PROMPT_STAGE: Record<string, PipelineStage> = {
  'analyze-layout': 'analyze',
  'generate-code': 'generate',
  'review-code': 'review',
  'optimize-code': 'optimize',
  'security-review': 'security',
};
