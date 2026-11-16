export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INVALID_CREDENTIALS"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "OTP_INVALID"
  | "OTP_EXPIRED";

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly details?: Record<string, string>;

  constructor(params: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string>;
  }) {
    super(params.message);
    this.code = params.code;
    this.details = params.details;
  }
}

export function toErrorPayload(err: unknown) {
  if (err instanceof ApiError) {
    const details = err.details;
    return {
      error: {
        code: err.code,
        message: err.message,
        ...(details ? { details } : {}),
      },
    };
  }

  return {
    error: {
      code: "INTERNAL_ERROR" as const,
      message: "Something went wrong",
    },
  };
}
