import { AiProvider } from './ai-provider.interface';
import { fetchWithTimeout } from '../../common/utils/fetch.util';

interface ClaudeResponse {
  content: { type: string; text: string }[];
}

export class ClaudeProvider implements AiProvider {
  name = 'claude';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const maxTokens = Number(process.env.AI_MAX_TOKENS || 8192);

    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    };
    if (systemPrompt) body.system = systemPrompt;

    const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude API error ${res.status}: ${err}`);
    }

    const data = (await res.json()) as ClaudeResponse;
    return data.content?.find((c) => c.type === 'text')?.text ?? '';
  }
}
