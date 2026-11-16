"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type LoginErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export default function CmsLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = (await res.json().catch(() => undefined)) as
        | LoginErrorPayload
        | undefined;

      if (!res.ok) {
        setErrorMessage(payload?.error?.message ?? "Login failed");
        return;
      }

      router.push("/cms/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243A]">CMS Login</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Access the Laboratory dashboard.
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

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#10243A]">
              Password
            </label>
            <Input
              ariaLabel="Password"
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
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

          <Button type="submit" variant="primary" disabled={!canSubmit} ariaLabel="Login">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <a
            href="/cms/forgot-password"
            className="text-[#0E7C7B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            Forgot password?
          </a>
        </div>
      </Card>
    </div>
  );
}
