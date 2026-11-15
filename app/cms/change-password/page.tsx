"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export default function CmsChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return currentPassword.length > 0 && newPassword.length >= 8 && !submitting;
  }, [currentPassword, newPassword, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const payload = (await res.json().catch(() => undefined)) as ApiErrorPayload | undefined;
      if (!res.ok) {
        setErrorMessage(payload?.error?.message ?? "Update failed");
        return;
      }

      setSuccessMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243A]">Change password</h1>
        <p className="mt-2 text-sm text-[#64748B]">Update your account password.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-[#10243A]"
            >
              Current password
            </label>
            <Input
              ariaLabel="Current password"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Current password"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-[#10243A]"
            >
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
            ariaLabel="Change password"
          >
            {submitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
