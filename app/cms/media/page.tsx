"use client";

import { useState } from "react";
import {
  useGetMediaQuery,
  useCreateMediaMutation,
  useDeleteMediaMutation,
} from "@/src/lib/services/rtk/mediaApi";
import Card from "@/components/ui/Card";

export default function CmsMediaPage() {
  const { data: mediaList = [], isLoading } = useGetMediaQuery();
  const [createMedia] = useCreateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const [form, setForm] = useState({
    filename: "",
    originalName: "",
    mimeType: "image/png",
    size: 1024,
    url: "",
    altText: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createMedia(form).unwrap();
      setForm({
        filename: "",
        originalName: "",
        mimeType: "image/png",
        size: 1024,
        url: "",
        altText: "",
      });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to add media record";
      setErrorMsg(errMsg);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete media?")) return;
    try {
      await deleteMedia(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Media Library</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Add Media Asset (External URL Reference)</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Filename</label>
            <input
              type="text"
              required
              placeholder="e.g. lab-building.jpg"
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value, originalName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Public Image URL</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Alt Text</label>
            <input
              type="text"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              Save Media Asset
            </button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Media Assets</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : mediaList.length === 0 ? (
          <p className="text-sm text-gray-500">No media assets found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mediaList.map((m) => (
              <div key={String(m._id)} className="border rounded-lg p-3 flex flex-col justify-between bg-white shadow-sm">
                <div>
                  <div className="h-32 bg-gray-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={String(m.url)} alt={String(m.altText || m.filename)} className="object-cover h-full w-full" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{String(m.filename)}</p>
                  <p className="text-xs text-gray-500 truncate">{String(m.url)}</p>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleDelete(String(m._id))}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
