import crypto from "crypto";
import bcrypt from "bcryptjs";

import { authConfig } from "@/src/lib/auth/config";
import type { AuthOtpPurpose } from "@/src/models/AuthOtpToken";

export function generateOtp(length = authConfig.otpLength): string {
  const digits = Math.max(4, Math.min(10, Math.floor(length)));
  const max = 10 ** digits;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(digits, "0");
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, authConfig.otpBcryptRounds);
}

export async function verifyOtp(otp: string, tokenHash: string): Promise<boolean> {
  return bcrypt.compare(otp, tokenHash);
}

export function otpPurposeLabel(purpose: AuthOtpPurpose): string {
  switch (purpose) {
    case "email_verification":
      return "email verification";
    case "password_reset":
      return "password reset";
  }
}
