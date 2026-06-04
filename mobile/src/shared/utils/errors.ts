/** User-facing message from a caught unknown error. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = String((error as { message: unknown }).message);
    if (msg.trim()) return msg;
  }
  return fallback;
}

const NETWORK_HINTS = [
  'network',
  'fetch',
  'timeout',
  'offline',
  'connection',
  'failed to fetch',
  'network request failed',
  'abort',
];

/** Heuristic for Supabase / fetch failures when offline or unreachable. */
export function isLikelyNetworkError(error: unknown): boolean {
  const msg = getErrorMessage(error, '').toLowerCase();
  return NETWORK_HINTS.some((hint) => msg.includes(hint));
}
