# Skills Status — Site2Code

Cập nhật lần cuối: hoàn tất cài đặt skills.

## Legend

| Status | Ý nghĩa |
|--------|---------|
| ✅ | Đã tải từ skills.sh |
| ⚠️ | Tải được nhưng không khớp 100% tên/mục đích |
| ❌ | Custom stub (không có hoặc tải thất bại trên skills.sh) |

---

## Tổng kết nhanh

| | Số lượng |
|---|----------|
| ✅ Từ skills.sh | **45** |
| ❌ Custom stub | **8** |
| **Tổng skill files** | **53** |
| **API integration** | ✅ `SkillLoaderService` injects skills per pipeline stage |

---

## 1. Skill chung (8/8)

| Skill | File | Status |
|-------|------|--------|
| typescript-pro | `common/typescript-pro.md` | ✅ |
| typescript-best-practices | `common/typescript-best-practices.md` | ⚠️ advanced-types |
| clean-code | `common/clean-code.md` | ✅ |
| software-architecture | `common/software-architecture.md` | ⚠️ improve-architecture |
| design-patterns | `common/design-pattern.md` | ⚠️ design-system-patterns |
| code-review | `common/code-review.md` | ✅ |
| debugging | `common/debugging.md` | ✅ |
| testing | `common/testing.md` | ✅ |

## 2. Frontend (11/11)

| Skill | File | Status |
|-------|------|--------|
| react | `frontend/react.md` | ✅ |
| nextjs | `frontend/nextjs.md` | ✅ |
| vue | `frontend/vue.md` | ✅ |
| nuxt | `frontend/nuxt.md` | ✅ |
| angular | `frontend/angular.md` | ✅ |
| svelte | `frontend/svelte.md` | ✅ |
| tailwindcss | `frontend/tailwind.md` | ✅ |
| bootstrap | `frontend/bootstrap.md` | ❌ |
| material-ui | `frontend/material-ui.md` | ❌ |
| shadcn-ui | `frontend/shadcn.md` | ✅ |
| chakra-ui | `frontend/chakra.md` | ❌ |

## 3. Backend (10/10)

| Skill | File | Status |
|-------|------|--------|
| nodejs | `backend/nodejs.md` | ✅ |
| express | `backend/express.md` | ⚠️ |
| nestjs | `backend/nestjs.md` | ✅ |
| spring-boot | `backend/springboot.md` | ✅ |
| aspnet-core | `backend/aspnet.md` | ⚠️ minimal-api |
| laravel | `backend/laravel.md` | ✅ |
| django | `backend/django.md` | ✅ |
| fastapi | `backend/fastapi.md` | ✅ |
| go | `backend/go.md` | ✅ |
| fiber | `backend/fiber.md` | ❌ |

## 4. Database (8/8)

| Skill | File | Status |
|-------|------|--------|
| postgresql | `database/postgres.md` | ✅ |
| mysql | `database/mysql.md` | ✅ |
| mongodb | `database/mongodb.md` | ✅ |
| sqlite | `database/sqlite.md` | ⚠️ prisma setup |
| prisma | `database/prisma.md` | ✅ |
| typeorm | `database/typeorm.md` | ✅ |
| drizzle | `database/drizzle.md` | ❌ |

## 5. Website Analysis (10/10)

| Skill | File | Status |
|-------|------|--------|
| html | `website-analysis/html.md` | ⚠️ web-design-guidelines |
| css | `website-analysis/css.md` | ❌ |
| javascript | `website-analysis/javascript.md` | ⚠️ web-design-guidelines |
| dom | `website-analysis/dom.md` | ⚠️ cheerio-parsing |
| accessibility | `website-analysis/accessibility.md` | ✅ |
| responsive-design | `website-analysis/responsive-design.md` | ⚠️ web-design-guidelines |
| seo | `website-analysis/seo.md` | ✅ |
| playwright | `crawler/playwright.md` | ✅ |
| cheerio | `crawler/cheerio.md` | ✅ |
| web-scraping | `crawler/web-scraping.md` | ✅ |
| dom-parser | `crawler/dom-parser.md` | ❌ |

## 6. AI Code Generation (6/6)

| Skill | File | Status |
|-------|------|--------|
| prompt-engineering | `ai-codegen/prompt-engineering.md` | ✅ |
| llm | `ai-codegen/llm.md` | ❌ |
| refactoring | `ai-codegen/refactoring.md` | ⚠️ |
| code-generation | `ai-codegen/code-generation.md` | ⚠️ |
| json-schema | `ai-codegen/json-schema.md` | ⚠️ |
| structured-output | `ai-codegen/structured-output.md` | ⚠️ |

## 7. Sau khi sinh code (7/7)

| Skill | File | Status |
|-------|------|--------|
| performance | `review/performance.md` | ✅ |
| security | `review/security.md` | ⚠️ |
| eslint | `review/eslint.md` | ⚠️ |
| prettier | `review/prettier.md` | ⚠️ chung eslint |
| optimization | `review/optimization.md` | ✅ |
| code-review | `review/code-review.md` | ✅ |
| accessibility | `review/accessibility.md` | ✅ |

---

## Cấu trúc thư mục (đã hoàn thành)

```
SITE2CODE/
├── apps/
│   ├── api/          ✅ NestJS
│   └── web/          ✅ Next.js
├── ai/
│   ├── prompts/      ✅ 5 files
│   ├── skills/       ✅ 53 skills
│   └── templates/    ✅ 6 stacks
├── docs/             ✅ 3 files
├── scripts/
│   ├── skills-manifest.json
│   └── install-skills.ps1
└── README.md
```

## Custom stubs cần bổ sung nội dung (8)

1. `frontend/bootstrap.md`
2. `frontend/chakra.md`
3. `frontend/material-ui.md`
4. `backend/fiber.md`
5. `database/drizzle.md`
6. `website-analysis/css.md`
7. `crawler/dom-parser.md`
8. `ai-codegen/llm.md`

## Cài lại skills

```powershell
.\scripts\install-skills.ps1
```

Script tự skip file đã có (`<!-- Source:` hoặc `CUSTOM STUB`).
