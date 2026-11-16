import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email" })
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password is too long" });

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{4,10}$/, { message: "OTP must be 4-10 digits" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().trim().min(2).max(100),
});

export const verifyEmailOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});
