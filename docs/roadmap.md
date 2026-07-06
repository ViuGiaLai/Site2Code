# Site2Code Roadmap

## Phase 1 — MVP

- [x] Monorepo structure (`apps/api`, `apps/web`, `ai/`, `docs/`)
- [x] NestJS API + Supabase PostgreSQL
- [x] AI prompts + skills catalog + per-stage provider routing
- [x] Next.js web UI (URL, stack, progress, download)
- [x] Playwright crawler + Cheerio DOM cleaner
- [x] Layout analyzer → code generator → review → optimize → security
- [x] ZIP export
- [ ] Preview generated site before download
- [ ] `ai/templates/` scaffolds per stack

## Phase 2 — Multi-Stack polish

- [ ] User review step for layout JSON before code generation
- [ ] More backend options in UI (django, laravel, go)
- [ ] ORM picker (prisma, typeorm, drizzle)

## Phase 3 — Quality

- [ ] Multimodal analyze (screenshot vision)
- [ ] Accessibility scoring in UI
- [ ] Rate limiting + job queue

## Phase 4 — Production

- [ ] Deploy Vercel + Railway
- [ ] Authentication + usage limits
