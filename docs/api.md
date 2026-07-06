# Site2Code API

Base URL: `http://localhost:3001/api` (development)

## Endpoints (planned)

### POST `/crawl`

Crawl a URL and return simplified DOM + screenshot.

**Request:**
```json
{
  "url": "https://example.com",
  "confirmedRights": true
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "completed",
  "html": "...",
  "screenshot": "base64...",
  "domSummary": { "sections": 5, "links": 12 }
}
```

### POST `/analyze`

Analyze crawled content into layout JSON.

**Request:**
```json
{
  "jobId": "uuid"
}
```

**Response:**
```json
{
  "layout": { "pageType": "landing", "sections": [...] }
}
```

### POST `/generate`

Generate project code from layout + stack selection.

**Request:**
```json
{
  "jobId": "uuid",
  "stack": {
    "frontend": "nextjs",
    "css": "tailwind",
    "backend": "nestjs",
    "database": "postgresql"
  }
}
```

**Response:**
```json
{
  "jobId": "uuid",
  "status": "generating",
  "files": []
}
```

### GET `/jobs/:id`

Poll job status.

**Response:**
```json
{
  "id": "uuid",
  "status": "completed | processing | failed",
  "progress": 75,
  "downloadUrl": "/export/uuid.zip"
}
```

### GET `/export/:id`

Download generated project as ZIP.

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Invalid URL or missing confirmation |
| 403 | Blocked domain (SSRF protection) |
| 404 | Job not found |
| 429 | Rate limit exceeded |
| 500 | Internal / AI failure |

## Environment Variables

```env
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=...
CRAWL_TIMEOUT_MS=30000
BLOCKED_DOMAINS=localhost,127.0.0.1
```
