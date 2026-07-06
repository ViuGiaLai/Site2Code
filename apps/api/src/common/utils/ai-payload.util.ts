import * as cheerio from 'cheerio';

/** Shrink HTML for AI analyze step — keeps structure, drops bloat. */
export function compressHtmlForAnalysis(html: string, maxChars = 60_000): string {
  const $ = cheerio.load(html);
  $('script, style, svg, iframe, noscript, link, meta').remove();
  const body = ($('body').html() || $.html()) ?? html;
  const compact = body.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxChars) return compact;
  return compact.slice(0, maxChars) + '\n<!-- truncated -->';
}

export interface AiFilePayload {
  path: string;
  content: string;
  language: string;
}

/** Cap total payload size sent to review/optimize/security AI calls. */
export function trimFilesForAi<T extends AiFilePayload>(
  files: T[],
  maxTotalChars = Number(process.env.AI_PAYLOAD_MAX_CHARS || 100_000),
): T[] {
  const total = files.reduce((sum, f) => sum + f.content.length, 0);
  if (total <= maxTotalChars) return files;

  const perFile = Math.max(1200, Math.floor(maxTotalChars / files.length));
  return files.map((f) => {
    if (f.content.length <= perFile) return f;
    const omitted = f.content.length - perFile;
    return {
      ...f,
      content: `${f.content.slice(0, perFile)}\n\n/* ... ${omitted} chars omitted for AI context */`,
    };
  });
}
