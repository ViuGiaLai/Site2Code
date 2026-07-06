# Drizzle ORM

> **Status: CUSTOM STUB** — Skill `bobmatnyc/claude-mpm-skills@drizzle-orm` tải thất bại từ skills.sh.
> Tham khảo: https://orm.drizzle.team/docs/overview

## Khi dùng trong Site2Code

Áp dụng khi user chọn **Drizzle ORM** làm database layer.

## Quy tắc sinh code

1. Schema: `src/db/schema.ts` với `pgTable`, `mysqlTable`, hoặc `sqliteTable`
2. Client: `drizzle-orm` + driver (`postgres.js`, `mysql2`, `better-sqlite3`)
3. Migrations: `drizzle-kit generate` + `drizzle-kit migrate`
4. Queries: type-safe `db.select().from(users).where(eq(users.id, id))`
5. Relations: `relations()` helper cho joins

## Cấu trúc project

```
src/db/
  schema.ts
  index.ts      # drizzle client export
drizzle/
  migrations/
drizzle.config.ts
```

## Ví dụ schema

```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```
