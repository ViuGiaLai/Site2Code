# LLM Integration

> **Status: CUSTOM STUB** — Không có skill LLM phù hợp trên skills.sh cho code generation pipeline.
> Site2Code dùng OpenRouter / Gemini API.

## Khi dùng trong Site2Code

Điều phối các bước AI: analyze → generate → review → optimize → security.

## Cấu hình

```env
OPENROUTER_API_KEY=sk-or-...
AI_MODEL=google/gemini-2.0-flash-001
AI_MAX_TOKENS=8192
AI_TEMPERATURE=0.2
```

## Model selection

| Bước | Model gợi ý | Lý do |
|------|-------------|-------|
| Analyze layout | Gemini Flash | Nhanh, rẻ, JSON output tốt |
| Generate code | Claude Sonnet / GPT-4o | Chất lượng code cao |
| Review | Gemini Flash | Đủ cho checklist review |
| Security | Claude Sonnet | Phân tích bảo mật tốt hơn |

## Quy tắc gọi API

1. Mỗi bước dùng prompt từ `ai/prompts/`
2. Inject skill context từ `ai/skills/{category}/` theo stack user chọn
3. Yêu cầu **structured JSON output** (xem `ai-codegen/json-schema.md`)
4. Retry tối đa 2 lần nếu JSON invalid
5. Log token usage per job

## Structured output

```typescript
const response = await openrouter.chat({
  model: AI_MODEL,
  messages: [
    { role: 'system', content: systemPrompt + skillContext },
    { role: 'user', content: userInput },
  ],
  response_format: { type: 'json_object' },
});
```
