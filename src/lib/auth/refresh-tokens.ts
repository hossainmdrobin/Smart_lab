import crypto from "crypto";

export function generateRefreshToken(): string {
  // base64url avoids '/' and '+' and is safe for cookies.
  return crypto.randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return crypto.timingSafeEqual(ab, bb);
}
