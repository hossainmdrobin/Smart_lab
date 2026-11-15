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
};

export default function CmsResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      otp.trim().length > 0 &&
      newPassword.length >= 8 &&
      !submitting
    );
  }, [email, otp, newPassword, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const payload = (await res.json().catch(() => undefined)) as
        | ApiErrorPayload
        | undefined;
      if (!res.ok) {
        setErrorMessage(payload?.error?.message ?? "Reset failed");
        return;
      }

      setSuccessMessage("Password updated. You can now sign in.");
      router.push("/cms/login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243A]">Reset password</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Enter the code you received by email.
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
            <label htmlFor="otp" className="text-sm font-medium text-[#10243A]">
              OTP code
            </label>
            <Input
              ariaLabel="OTP code"
              name="otp"
              type="text"
              value={otp}
              onChange={setOtp}
              placeholder="123456"
              autoComplete="one-time-code"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-sm font-medium text-[#10243A]">
              New password
            </label>
            <Input
              ariaLabel="New password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="At least 8 characters"
              autoComplete="new-password"
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

          {successMessage ? (
            <div
              className="rounded-md border border-[#0E7C7B] bg-[#ECFEFF] px-3 py-2 text-sm text-[#115E59]"
              role="status"
            >
              {successMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit}
            ariaLabel="Reset password"
          >
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm">
          <a
            href="/cms/login"
            className="text-[#0E7C7B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            Back to login
          </a>
        </div>
      </Card>
    </div>
  );
}
