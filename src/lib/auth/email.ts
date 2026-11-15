import nodemailer from "nodemailer";

import { authConfig } from "@/src/lib/auth/config";
import type { AuthOtpPurpose } from "@/src/models/AuthOtpToken";

export async function sendOtpEmail(params: {
  toEmail: string;
  otp: string;
  purpose: AuthOtpPurpose;
  expiresAt: Date;
}): Promise<void> {
  if (!authConfig.smtpHost || !authConfig.smtpPort) {
    throw new Error("Missing SMTP configuration for OTP emails");
  }
  if (!authConfig.smtpUser || !authConfig.smtpPass) {
    throw new Error("Missing SMTP credentials for OTP emails");
  }
  if (!authConfig.emailFrom) {
    throw new Error("Missing EMAIL_FROM configuration");
  }

  const purposeText =
    params.purpose === "email_verification"
      ? "verify your email"
      : "reset your password";

  const transporter = nodemailer.createTransport({
    host: authConfig.smtpHost,
    port: authConfig.smtpPort,
    secure: authConfig.smtpPort === 465,
    auth: {
      user: authConfig.smtpUser,
      pass: authConfig.smtpPass,
    },
  });

  const expiresIso = params.expiresAt.toISOString();
  const linkNote = authConfig.appBaseUrl
    ? `(${authConfig.appBaseUrl})`
    : undefined;

  await transporter.sendMail({
    from: authConfig.emailFrom,
    to: params.toEmail,
    subject: `OTP: ${purposeText}`,
    text: [
      `Your one-time code is: ${params.otp}`,
      `Purpose: ${purposeText}`,
      `Expires at (UTC): ${expiresIso}`,
      linkNote
        ? `If you did not request this, you can ignore this message. ${linkNote}`
        : "If you did not request this, you can ignore this message.",
    ].join("\n"),
  });
}
