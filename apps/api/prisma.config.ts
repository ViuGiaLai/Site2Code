import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'prisma/config';

const envPaths = [
  resolve(process.cwd(), '..', '..', '.env'),
  resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath, override: true });
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
