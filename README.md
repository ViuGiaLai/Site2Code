# Site2Code

**URL → Code**: Phân tích website và sinh project theo stack công nghệ bạn chọn.

## Cấu trúc dự án

```
SITE2CODE/
├── apps/
│   ├── api/                 # NestJS backend
│   └── web/                 # Next.js frontend
├── ai/
│   ├── prompts/             # Prompt templates cho AI pipeline
│   ├── skills/              # Domain skills (từ skills.sh + custom)
│   └── templates/           # Starter scaffolds theo stack
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   └── api.md
└── scripts/
    ├── skills-manifest.json # Mapping skill → skills.sh source
    └── install-skills.ps1   # Tải skills từ skills.sh
```

## AI Pipeline

```
URL → Playwright → Cheerio → HTML/CSS/JS analysis
  → Software Architecture
  → [Frontend: React | Vue | Angular | ...]
  → [Backend: NestJS | Spring | FastAPI | ...]
  → [Database: PostgreSQL | MySQL | ...]
  → Code Review → Performance → Security
  → Export ZIP
```

## Quick Start

### API (NestJS)

```bash
cd apps/api
npm install
npm run start:dev
```

### Web (Next.js)

```bash
cd apps/web
npm install
npm run dev
```

### Cài skills từ skills.sh

```bash
.\scripts\install-skills.ps1
```

## Skills

Khoảng **50 skills** phục vụ pipeline phân tích → sinh code. Xem `ai/skills/SKILLS-STATUS.md` để biết skill nào đã tải, skill nào cần viết custom.

## Tài liệu

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [API](docs/api.md)
- [Kế hoạch chi tiết](Site2codeplan.MD)

## Lưu ý pháp lý

Tool chỉ dùng cho website bạn **có quyền** tái tạo. Không copy nguyên văn nội dung, hình ảnh, hoặc thương hiệu gốc.
