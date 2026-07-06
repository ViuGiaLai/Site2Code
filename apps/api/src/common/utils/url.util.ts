import { BadRequestException } from '@nestjs/common';

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  'metadata.google.internal',
]);

function isPrivateIp(hostname: string): boolean {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  if (/^169\.254\./.test(hostname)) return true;
  if (/^fc00:/i.test(hostname) || /^fd/i.test(hostname)) return true;
  return false;
}

function parseUrl(url: string): URL {
  try {
    return new URL(url);
  } catch {
    throw new BadRequestException('Invalid URL');
  }
}

/** Host-only check (for redirect targets). */
export function validateCrawlHost(url: string): void {
  const parsed = parseUrl(url);

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new BadRequestException('Only http and https URLs are allowed');
  }

  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host) || isPrivateIp(host)) {
    throw new BadRequestException('Blocked URL: internal or local addresses are not allowed');
  }

  const blockedDomains = (process.env.BLOCKED_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  if (blockedDomains.some((d) => host === d || host.endsWith(`.${d}`))) {
    throw new BadRequestException('This domain is not allowed');
  }
}

export function validateCrawlUrl(url: string, confirmedRights: boolean): void {
  if (!confirmedRights) {
    throw new BadRequestException('You must confirm you have rights to use this URL content');
  }
  validateCrawlHost(url);
}
