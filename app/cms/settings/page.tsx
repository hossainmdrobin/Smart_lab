"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetSettingsQuery,
  useUpdateSettingMutation,
} from "@/src/lib/services/rtk/settingsApi";
import Card from "@/components/ui/Card";

export default function CmsSettingsPage() {
  const { data } = useGetSettingsQuery();
  const [updateSetting] = useUpdateSettingMutation();

  const settingsMap = data?.settings || {};
  const [labTitle, setLabTitle] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>(null);

  const currentLabTitle = labTitle ?? (typeof settingsMap.labTitle === "string" ? settingsMap.labTitle : "Laboratory of Algorithmic Life Sciences");
  const currentContactEmail = contactEmail ?? (typeof settingsMap.contactEmail === "string" ? settingsMap.contactEmail : "contact@lals.ac.bd");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await updateSetting({ key: "labTitle", value: currentLabTitle, type: "string" }).unwrap();
      await updateSetting({ key: "contactEmail", value: currentContactEmail, type: "string" }).unwrap();
      setSuccessMsg("Settings updated successfully");
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to update settings";
      setErrorMsg(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Site Settings (Admin Only)</h1>
      {successMsg && <div className="rounded bg-green-50 p-3 text-sm text-green-700">{successMsg}</div>}
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">General Configuration</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Laboratory Title</label>
            <input
              type="text"
              required
              value={currentLabTitle}
              onChange={(e) => setLabTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              required
              value={currentContactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              Save Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
