import { AiProvider } from './ai-provider.interface';
import { fetchWithTimeout } from '../../common/utils/fetch.util';

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
}

export class OpenAiCompatibleProvider implements AiProvider {
  constructor(
    public readonly name: string,
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
    private readonly extraHeaders: Record<string, string> = {},
  ) {}

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const maxTokens = Number(process.env.AI_MAX_TOKENS || 8192);
    const temperature = Number(process.env.AI_TEMPERATURE || 0.2);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.extraHeaders,
    };
    if (this.apiKey && this.apiKey !== 'not-needed') {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const url = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`${this.name} API error ${res.status}: ${err}`);
    }

    const data = (await res.json()) as ChatCompletionResponse;
    return data.choices?.[0]?.message?.content ?? '';
  }
}
