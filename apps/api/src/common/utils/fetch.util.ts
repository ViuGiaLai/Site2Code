/** Fetch with configurable timeout (default 120s). */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 120_000),
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
