# Site2Code API

Base URL: `http://localhost:3001/api` (development)

## Endpoints

### POST `/api/crawl`

Start full pipeline (crawl → analyze → generate → review → optimize → security → ZIP).

**Request:**
```json
{
  "url": "https://example.com",
  "confirmedRights": true,
  "frontend": "nextjs",
  "css": "tailwind",
  "backend": "nestjs",
  "database": "postgresql"
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "crawling"
}
```

### GET `/api/jobs/:id`

Poll job status.

**Response:**
```json
{
  "id": "uuid",
  "status": "analyzing",
  "progress": 25,
  "error": null,
  "downloadUrl": null
}
```

**Status values:** `crawling` → `analyzing` → `generating` → `reviewing` → `optimizing` → `security` → `packaging` → `completed` | `failed`

When `status === "completed"`, `downloadUrl` is `/api/export/{id}`.

### GET `/api/export/:id`

Download generated project as ZIP.

### POST `/crawler/crawl` (dev only)

Crawl-only endpoint. Requires `confirmedRights`. Same URL validation as pipeline.

---

## Environment Variables

Config lives in **root `.env`** (loaded first), then `apps/api/.env` overrides.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `GEMINI_API_KEY` | One of* | Google Gemini |
| `OPENROUTER_API_KEY` | One of* | OpenRouter fallback |
| `CLAUDE_API_KEY` | Optional | Code generation (recommended) |
| `PORT` | No | API port (default `3001`) |
| `CRAWL_TIMEOUT_MS` | No | Crawl timeout (default `30000`) |
| `AI_ANALYZE_PROVIDER` | No | Override stage provider |
| `AI_GENERATE_PROVIDER` | No | Override stage provider |
| `AI_MAX_RETRIES` | No | Retries per provider (default `2`) |
| `BLOCKED_DOMAINS` | No | Comma-separated blocked domains |

\*At least one AI provider API key required.

See root `.env.example` for full provider list.
