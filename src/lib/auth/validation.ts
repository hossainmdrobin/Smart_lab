import type { ZodError } from "zod";

export function formatZodError(err: ZodError): {
  [key: string]: string;
} {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const path = issue.path.length ? issue.path.join(".") : "root";
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
