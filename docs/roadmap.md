# Site2Code Roadmap

## Phase 1 — MVP (Weeks 1–3)

- [x] Monorepo structure (`apps/api`, `apps/web`, `ai/`, `docs/`)
- [x] NestJS API scaffold
- [x] AI prompts + skills catalog
- [ ] Next.js web UI (URL input, stack picker, progress)
- [ ] Playwright crawler module
- [ ] Cheerio DOM simplifier
- [ ] Layout analyzer (AI → JSON)
- [ ] Code generator (Next.js + Tailwind only)
- [ ] ZIP export

**MVP scope**: static landing pages only, single output stack (Next.js + Tailwind).

## Phase 2 — Multi-Stack (Weeks 4–6)

- [ ] Stack picker: React, Vue, Angular, Svelte
- [ ] Backend options: NestJS, Express, FastAPI
- [ ] Database options: PostgreSQL, MySQL, MongoDB
- [ ] User review step for layout JSON before code generation
- [ ] Code review + auto-fix pipeline

## Phase 3 — Quality (Weeks 7–9)

- [ ] Performance optimization pass
- [ ] Security audit pass
- [ ] Accessibility scoring
- [ ] Preview generated site before download
- [ ] Project history (PostgreSQL)

## Phase 4 — Production (Weeks 10–12)

- [ ] Authentication (optional accounts)
- [ ] Rate limiting + queue (Bull/BullMQ)
- [ ] Billing / usage limits
- [ ] Deploy to Vercel + Railway
- [ ] Public beta launch

## Out of Scope (for now)

- Kubernetes, advanced DevOps
- Blockchain, ML, data science skills
- Full ecommerce / auth / payment cloning
- Local LLM (use API first)
