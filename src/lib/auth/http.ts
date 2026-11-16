import {
  ApiError,
  toErrorPayload,
  type ApiErrorCode,
} from "@/src/lib/auth/api-errors";

function statusForCode(code: ApiErrorCode): number {
  switch (code) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "INVALID_CREDENTIALS":
      return 401;
    case "BAD_REQUEST":
      return 400;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "OTP_INVALID":
      return 400;
    case "OTP_EXPIRED":
      return 400;
    case "RATE_LIMITED":
      return 429;
    default:
      return 500;
  }
}

export function sendError(res: Response, err: ApiError): Response {
  const status = statusForCode(err.code);
  return new Response(JSON.stringify(toErrorPayload(err)), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export function sendOk<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

export function apiError(params: {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string>;
}): ApiError {
  return new ApiError(params);
}
