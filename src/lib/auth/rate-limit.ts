type RateState = {
  count: number;
  firstAtMs: number;
};

const state = new Map<string, RateState>();

export function checkRateLimit(params: {
  key: string;
  max: number;
  windowMs: number;
}): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const existing = state.get(params.key);

  if (!existing) {
    state.set(params.key, { count: 1, firstAtMs: now });
    return { allowed: true };
  }

  const elapsed = now - existing.firstAtMs;
  if (elapsed > params.windowMs) {
    state.set(params.key, { count: 1, firstAtMs: now });
    return { allowed: true };
  }

  if (existing.count >= params.max) {
    return { allowed: false, retryAfterMs: params.windowMs - elapsed };
  }

  existing.count += 1;
  state.set(params.key, existing);
  return { allowed: true };
}

export function getClientIpFromHeaders(headers: Headers): string {
  const xf = headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  const xri = headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
