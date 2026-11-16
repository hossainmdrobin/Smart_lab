"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} from "@/src/lib/services/rtk/newsApi";
import Card from "@/components/ui/Card";

export default function CmsNewsPage() {
  const { data: newsList = [], isLoading } = useGetNewsQuery();
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    publishedAt: new Date().toISOString().substring(0, 10),
    status: "published",
    featured: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isEditing) {
        await updateNews({ id: isEditing, data: form }).unwrap();
        setIsEditing(null);
      } else {
        await createNews(form).unwrap();
      }
      setForm({ title: "", summary: "", content: "", publishedAt: new Date().toISOString().substring(0, 10), status: "published", featured: false });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(n: Record<string, unknown>) {
    setIsEditing(n._id as string);
    const pubDate = n.publishedAt ? String(n.publishedAt).substring(0, 10) : new Date().toISOString().substring(0, 10);
    setForm({
      title: (n.title as string) || "",
      summary: (n.summary as string) || "",
      content: (n.content as string) || "",
      publishedAt: pubDate,
      status: (n.status as string) || "published",
      featured: (n.featured as boolean) || false,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete article?")) return;
    try {
      await deleteNews(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">News & Updates Management</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit News Article" : "Add News Article"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              rows={2}
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Published Date</label>
            <input
              type="date"
              required
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Full Content (Markdown)</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0E7C7B]"
              />
              Featured News
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Article" : "Create Article"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({ title: "", summary: "", content: "", publishedAt: new Date().toISOString().substring(0, 10), status: "published", featured: false });
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">News List</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : newsList.length === 0 ? (
          <p className="text-sm text-gray-500">No news articles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newsList.map((n) => (
                  <tr key={String(n._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(n.title)}</td>
                    <td className="p-3">{new Date(String(n.publishedAt)).toLocaleDateString()}</td>
                    <td className="p-3 capitalize">{String(n.status)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(n)} className="text-[#0E7C7B] hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(String(n._id))} className="text-red-600 hover:underline font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
