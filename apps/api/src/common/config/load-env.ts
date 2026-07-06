import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

/** Load root .env first, then apps/api/.env (later overrides). */
export function loadEnvFiles(): void {
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, '..', '..', '.env'),
    resolve(cwd, '.env'),
  ];

  const seen = new Set<string>();
  for (const envPath of candidates) {
    const normalized = resolve(envPath);
    if (seen.has(normalized) || !existsSync(normalized)) continue;
    config({ path: normalized, override: true });
    seen.add(normalized);
  }
}

/** Walk up from cwd to find monorepo paths like ai/prompts. */
export function resolveMonorepoPath(...segments: string[]): string {
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = resolve(dir, ...segments);
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(process.cwd(), '..', '..', ...segments);
}
