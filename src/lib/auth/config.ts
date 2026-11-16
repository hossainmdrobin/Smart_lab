export const authConfig = {
  accessSecret: process.env.AUTH_ACCESS_TOKEN_SECRET ??
    process.env.AUTH_JWT_SECRET,
  refreshSecret: process.env.AUTH_REFRESH_TOKEN_SECRET ?? process.env.AUTH_JWT_SECRET,
  accessTtlSeconds: Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS ?? 60 * 60),
  refreshTtlSeconds: Number(process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 7),
  cookieSecure: process.env.NODE_ENV === "production",
  cookieSameSite: (process.env.AUTH_COOKIE_SAMESITE as "lax" | "strict" | "none") ?? "lax",

  otpTtlSeconds: Number(process.env.AUTH_OTP_TTL_SECONDS ?? 60 * 10),
  otpLength: Number(process.env.AUTH_OTP_LENGTH ?? 6),
  otpBcryptRounds: Number(process.env.AUTH_OTP_BCRYPT_ROUNDS ?? 10),

  bcryptRounds: Number(process.env.AUTH_BCRYPT_ROUNDS ?? 10),

  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT ?? 0),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  appBaseUrl: process.env.APP_BASE_URL,

  rate: {
    loginMax: Number(process.env.AUTH_RATE_LIMIT_LOGIN_MAX ?? 10),
    loginWindowMs: Number(process.env.AUTH_RATE_LIMIT_LOGIN_WINDOW_MS ?? 60_000),

    forgotMax: Number(process.env.AUTH_RATE_LIMIT_FORGOT_PASSWORD_MAX ?? 5),
    forgotWindowMs: Number(process.env.AUTH_RATE_LIMIT_FORGOT_PASSWORD_WINDOW_MS ?? 60 * 60_000),

    otpMax: Number(process.env.AUTH_RATE_LIMIT_OTP_MAX ?? 10),
    otpWindowMs: Number(process.env.AUTH_RATE_LIMIT_OTP_WINDOW_MS ?? 60_000),
  },
} as const;
