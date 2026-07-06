# Site2Code

**URL → Code**: Phân tích website và sinh project theo stack công nghệ bạn chọn.

## Quick Start

### 1. Cấu hình `.env` (root)

Copy `.env.example` → `.env` và điền:
- `DATABASE_URL` — Supabase PostgreSQL
- `GEMINI_API_KEY` và/hoặc `OPENROUTER_API_KEY`, `CLAUDE_API_KEY`

### 2. API (port **3001**)

```bash
cd apps/api
npm install
npx prisma migrate deploy
npm run start:dev
```

### 3. Web (port **3000**)

```bash
cd apps/web
cp .env.local.example .env.local
npm install
npm run dev
```

Mở http://localhost:3000 — API tại http://localhost:3001

## AI Pipeline

```
POST /api/crawl → crawl → analyze → generate → review → optimize → security → ZIP
```

Mỗi bước dùng provider riêng (Gemini, Claude, OpenRouter, ...) — xem `ai/skills/ai-codegen/llm.md`.

## Cấu trúc

```
SITE2CODE/
├── apps/api/          # NestJS backend
├── apps/web/          # Next.js frontend
├── ai/prompts/        # 5 prompt templates
├── ai/skills/         # ~59 domain skills
└── docs/              # architecture, api, roadmap
```

## Tài liệu

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Roadmap](docs/roadmap.md)
- [Skills status](ai/skills/SKILLS-STATUS.md)

## Lưu ý pháp lý

Chỉ dùng với website bạn **có quyền** tái tạo. Checkbox `confirmedRights` bắt buộc trước khi crawl.
