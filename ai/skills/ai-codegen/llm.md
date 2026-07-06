# LLM Integration

Site2Code routes **each pipeline stage** to free-tier providers from `.env`.

## Pipeline routing (free tier)

| Stage | Prompt | Primary | Fallback chain |
|-------|--------|---------|----------------|
| Analyze | `analyze-layout` | gemini | groq → cerebras → openrouter → github → cloudflare → nvidia |
| Generate | `generate-code` | groq | cerebras → gemini → openrouter → github → cloudflare → nvidia-deepseek → nvidia → freemodel |
| Review | `review-code` | gemini | groq → openrouter → github → cloudflare |
| Optimize | `optimize-code` | cerebras | groq → gemini → openrouter → github → cloudflare |
| Security | `security-review` | gemini | groq → openrouter → github → cloudflare |

Override per stage in `.env`:

```env
AI_ANALYZE_PROVIDER=gemini
AI_GENERATE_PROVIDER=groq
AI_REVIEW_PROVIDER=gemini
AI_OPTIMIZE_PROVIDER=cerebras
AI_SECURITY_PROVIDER=gemini
```

## Free providers (`.env` keys)

| Provider | API Key | Model | Notes |
|----------|---------|-------|-------|
| gemini | `GEMINI_API_KEY` | `GEMINI_MODEL` | Analyze, review, security |
| groq | `GROQ_API_KEY` | `GROQ_MODEL` | Fast code generation |
| cerebras | `CEREBRAS_API_KEY` | `CEREBRAS_MODEL` | Fast optimize |
| openrouter | `OPENROUTER_API_KEY` | `OPENROUTER_MODEL` | Free models e.g. `qwen/qwen3-coder:free` |
| github | `GITHUB_API_KEY` | `GITHUB_MODEL` | Free quota |
| nvidia | `NVIDIA_API_KEY` | `NVIDIA_MODEL` | Free NIM tier |
| nvidia-deepseek | `NVIDIA_DEEPSEEK_API_KEY` | `NVIDIA_DEEPSEEK_MODEL` | Free NIM DeepSeek |
| cloudflare | `CLOUDFLARE_API_KEY` + `CLOUDFLARE_ACCOUNT_ID` | `CLOUDFLARE_MODEL` | Workers AI free tier |
| freemodel | `FREEMODEL_API_KEY` | `FREEMODEL_MODEL` | Demo fallback |
| local | `LLAMA_SERVER_URL` | `LOCAL_MODEL` | Offline (`LLM_MODE=local`) |

## Minimum setup

```env
GEMINI_API_KEY=your-key    # analyze, review, security
GROQ_API_KEY=your-key      # generate (fast)
CEREBRAS_API_KEY=your-key  # optimize (optional)
OPENROUTER_API_KEY=your-key  # fallback all stages
```
