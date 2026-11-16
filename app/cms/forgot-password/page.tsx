"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
  data?: {
    message?: string;
  };
};

export default function CmsForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && !submitting;
  }, [email, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const payload = (await res.json().catch(() => undefined)) as ApiErrorPayload | undefined;

      if (!res.ok) {
        setErrorMessage(payload?.error?.message ?? "Request failed");
        return;
      }

      setMessage(payload?.data?.message ?? "Request successful.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243A]">Forgot password</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Enter your email to receive a one-time code.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#10243A]">
              Email
            </label>
            <Input
              ariaLabel="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          {errorMessage ? (
            <div
              className="rounded-md border border-[#DC2626] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          {message ? (
            <div
              className="rounded-md border border-[#0E7C7B] bg-[#ECFEFF] px-3 py-2 text-sm text-[#115E59]"
              role="status"
            >
              {message}
            </div>
          ) : null}

          <Button type="submit" variant="primary" disabled={!canSubmit} ariaLabel="Send code">
            {submitting ? "Sending..." : "Send code"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <a
            href="/cms/login"
            className="text-[#0E7C7B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            Back to login
          </a>
          <button
            type="button"
            onClick={() => router.push("/cms/reset-password")}
            className="w-fit text-left text-[#0E7C7B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            Enter code
          </button>
        </div>
      </Card>
    </div>
  );
}
