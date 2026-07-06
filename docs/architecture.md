# Site2Code Architecture

## Overview

Site2Code converts a **URL** into a **downloadable project** in the user's chosen tech stack.

```
User URL + Stack Selection
        ↓
    NestJS API (apps/api)
        ↓
    Playwright → Cheerio → Layout JSON
        ↓
    AI Pipeline (prompts + skills)
        ↓
    Code Generation → Review → Optimize → Security
        ↓
    ZIP Export
```

## Monorepo Structure

```
SITE2CODE/
├── apps/
│   ├── api/          # NestJS — crawl, AI orchestration, export
│   └── web/          # Next.js — user interface
├── ai/
│   ├── prompts/      # AI prompt templates
│   ├── skills/       # Domain knowledge (from skills.sh + custom)
│   └── templates/    # Planned starter scaffolds (see ai/templates/README.md)
└── docs/
```

## Core Modules (API)

| Module | Responsibility |
|--------|----------------|
| `crawler` | Playwright fetch, Cheerio DOM parse, screenshot |
| `analyzer` | Layout analysis via AI (prompt: analyze-layout) |
| `generator` | Code generation per stack (prompt: generate-code) |
| `reviewer` | Code review, optimize, security (prompts: review/optimize/security) |
| `export` | ZIP packaging and download |

## AI Skill Pipeline

Skills are loaded from `ai/skills/` based on user stack selection:

```
URL → playwright → cheerio → html/css/javascript
  → software-architecture
  → [frontend skill] → [backend skill] → [database skill]
  → code-review → performance → security
  → Export ZIP
```

## Tech Stack (MVP)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ App Router + Tailwind |
| Backend | NestJS + TypeScript |
| Crawler | Playwright + Cheerio |
| Database | Supabase PostgreSQL (Session Pooler) + Prisma |
| AI | OpenRouter / Gemini API |
| Export | adm-zip |

## Security & Legal

- URL allowlist / blocklist (no localhost, internal IPs)
- User must confirm rights to use source content
- AI prompts enforce: no verbatim copy, no original branding
- SSRF protection on crawl endpoints

## Deployment

- **Web**: Vercel
- **API + DB**: Railway
