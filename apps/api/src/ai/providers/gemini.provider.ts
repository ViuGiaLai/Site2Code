import { AiProvider } from './ai-provider.interface';
import { fetchWithTimeout } from '../../common/utils/fetch.util';

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

export class GeminiProvider implements AiProvider {
  name = 'gemini';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: Number(process.env.AI_MAX_TOKENS || 8192),
        temperature: Number(process.env.AI_TEMPERATURE || 0.2),
      },
    };
    if (systemPrompt) {
      body.systemInstruction = { parts: [{ text: systemPrompt }] };
    }

    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = (await res.json()) as GeminiResponse;
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}
