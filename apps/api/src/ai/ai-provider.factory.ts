import { AiProvider } from './providers/ai-provider.interface';
import { ClaudeProvider } from './providers/claude.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { OpenAiCompatibleProvider } from './providers/openai-compatible.provider';
import { ProviderId } from './ai-stage.config';

type ProviderFactory = () => AiProvider | null;

const PROVIDERS: Record<ProviderId, ProviderFactory> = {
  gemini: () => {
    const key = process.env.GEMINI_API_KEY?.trim();
    if (!key) return null;
    return new GeminiProvider(key, process.env.GEMINI_MODEL || 'gemini-2.5-flash');
  },

  claude: () => {
    const key = process.env.CLAUDE_API_KEY?.trim();
    if (!key) return null;
    return new ClaudeProvider(key, process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514');
  },

  deepseek: () => {
    const key = process.env.DEEPSEEK_API_KEY?.trim();
    // nvapi-* keys belong in NVIDIA_* env vars, not DEEPSEEK_API_KEY
    if (!key || key.startsWith('nvapi-')) return null;
    return new OpenAiCompatibleProvider(
      'deepseek',
      key,
      process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      'https://api.deepseek.com/v1',
    );
  },

  github: () => {
    const key = process.env.GITHUB_API_KEY?.trim();
    if (!key) return null;
    const base = process.env.GITHUB_URL || 'https://models.inference.ai.azure.com';
    return new OpenAiCompatibleProvider(
      'github',
      key,
      process.env.GITHUB_MODEL || 'gpt-4o-mini',
      base.endsWith('/v1') ? base : `${base}/v1`,
    );
  },

  openrouter: () => {
    const key = process.env.OPENROUTER_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'openrouter',
      key,
      process.env.OPENROUTER_MODEL || 'qwen/qwen3-coder:free',
      process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      { 'HTTP-Referer': 'https://site2code.local', 'X-Title': 'Site2Code' },
    );
  },

  nvidia: () => {
    const key = process.env.NVIDIA_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'nvidia',
      key,
      process.env.NVIDIA_MODEL || 'moonshotai/kimi-k2.6',
      'https://integrate.api.nvidia.com/v1',
    );
  },

  'nvidia-deepseek': () => {
    const key = process.env.NVIDIA_DEEPSEEK_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'nvidia-deepseek',
      key,
      process.env.NVIDIA_DEEPSEEK_MODEL || 'deepseek-ai/deepseek-v4-pro',
      'https://integrate.api.nvidia.com/v1',
    );
  },

  groq: () => {
    const key = process.env.GROQ_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'groq',
      key,
      process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      'https://api.groq.com/openai/v1',
    );
  },

  cerebras: () => {
    const key = process.env.CEREBRAS_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'cerebras',
      key,
      process.env.CEREBRAS_MODEL || 'llama3.1-8b',
      process.env.CEREBRAS_URL || 'https://api.cerebras.ai/v1',
    );
  },

  cohere: () => {
    const key = process.env.COHERE_API_KEY?.trim();
    if (!key) return null;
    return new OpenAiCompatibleProvider(
      'cohere',
      key,
      process.env.COHERE_MODEL || 'command-r-plus',
      process.env.COHERE_URL || 'https://api.cohere.com/compatibility/v1',
    );
  },

  cloudflare: () => {
    const key = process.env.CLOUDFLARE_API_KEY?.trim();
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
    if (!key || !accountId) return null;
    return new OpenAiCompatibleProvider(
      'cloudflare',
      key,
      process.env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
    );
  },

  freemodel: () => {
    const key = process.env.FREEMODEL_API_KEY?.trim();
    if (!key) return null;
    const base = process.env.FREEMODEL_URL || 'https://api.freemodel.dev/v1';
    return new OpenAiCompatibleProvider(
      'freemodel',
      key,
      process.env.FREEMODEL_MODEL || 'gpt-4o-mini',
      base,
    );
  },
};

export function createProvider(id: ProviderId): AiProvider | null {
  return PROVIDERS[id]?.() ?? null;
}

export function listConfiguredProviders(): ProviderId[] {
  return (Object.keys(PROVIDERS) as ProviderId[]).filter((id) => createProvider(id) !== null);
}

export function resolveProvider(chain: ProviderId[]): AiProvider {
  for (const id of chain) {
    const provider = createProvider(id);
    if (provider) return provider;
  }
  throw new Error(
    `No AI provider available. Set at least one API key. Tried: ${chain.join(', ')}`,
  );
}
