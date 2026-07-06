export interface AiProvider {
  name: string;
  generate(prompt: string, systemPrompt?: string): Promise<string>;
}
