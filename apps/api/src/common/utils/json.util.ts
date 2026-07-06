function stripCodeFences(text: string): string {
  let trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, '');
    trimmed = trimmed.replace(/\s*```\s*$/i, '');
    return trimmed.trim();
  }
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function findBalancedJson(text: string, open: '{' | '[', close: '}' | ']'): string | null {
  const start = text.indexOf(open);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === open) depth++;
    if (ch === close) depth--;
    if (depth === 0) return text.slice(start, i + 1);
  }
  return null;
}

export function extractJsonObject(text: string): Record<string, unknown> {
  const cleaned = stripCodeFences(text);
  const candidate = findBalancedJson(cleaned, '{', '}');
  if (!candidate) throw new Error('No JSON object found in AI response');
  return JSON.parse(candidate) as Record<string, unknown>;
}

export function extractJsonArray<T = unknown>(text: string): T[] {
  const cleaned = stripCodeFences(text);
  const arrayCandidate = findBalancedJson(cleaned, '[', ']');
  if (arrayCandidate) {
    try {
      return JSON.parse(arrayCandidate) as T[];
    } catch {
      /* try object wrapper next */
    }
  }
  const objectCandidate = findBalancedJson(cleaned, '{', '}');
  if (objectCandidate) {
    const parsed = JSON.parse(objectCandidate) as { files?: T[] };
    if (Array.isArray(parsed.files)) return parsed.files;
  }
  throw new Error('No JSON array found in AI response');
}
