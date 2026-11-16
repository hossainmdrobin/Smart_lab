"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetPublicationsQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} from "@/src/lib/services/rtk/publicationsApi";
import Card from "@/components/ui/Card";

export default function CmsPublicationsPage() {
  const { data: pubs = [], isLoading } = useGetPublicationsQuery();
  const [createPub] = useCreatePublicationMutation();
  const [updatePub] = useUpdatePublicationMutation();
  const [deletePub] = useDeletePublicationMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    authorsStr: "",
    journal: "",
    year: new Date().getFullYear(),
    type: "journal-article",
    status: "published",
    doi: "",
    publisherUrl: "",
    abstract: "",
    featured: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const payload = {
        ...form,
        authors: form.authorsStr.split(",").map((a) => a.trim()).filter(Boolean),
      };
      if (isEditing) {
        await updatePub({ id: isEditing, data: payload }).unwrap();
        setIsEditing(null);
      } else {
        await createPub(payload).unwrap();
      }
      setForm({
        title: "",
        authorsStr: "",
        journal: "",
        year: new Date().getFullYear(),
        type: "journal-article",
        status: "published",
        doi: "",
        publisherUrl: "",
        abstract: "",
        featured: false,
      });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to save publication";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(pub: Record<string, unknown>) {
    setIsEditing(pub._id as string);
    setForm({
      title: (pub.title as string) || "",
      authorsStr: ((pub.authors as string[]) || []).join(", "),
      journal: (pub.journal as string) || "",
      year: (pub.year as number) || new Date().getFullYear(),
      type: (pub.type as string) || "journal-article",
      status: (pub.status as string) || "published",
      doi: (pub.doi as string) || "",
      publisherUrl: (pub.publisherUrl as string) || "",
      abstract: (pub.abstract as string) || "",
      featured: (pub.featured as boolean) || false,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete publication?")) return;
    try {
      await deletePub(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Publications Management</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit Publication" : "Add Publication"}
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
            <label className="block text-sm font-medium text-gray-700">Authors (comma-separated)</label>
            <input
              type="text"
              required
              value={form.authorsStr}
              onChange={(e) => setForm({ ...form, authorsStr: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Journal / Venue</label>
            <input
              type="text"
              required
              value={form.journal}
              onChange={(e) => setForm({ ...form, journal: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              required
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            >
              <option value="journal-article">Journal Article</option>
              <option value="review">Review</option>
              <option value="preprint">Preprint</option>
              <option value="other">Other</option>
            </select>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">DOI</label>
            <input
              type="text"
              value={form.doi}
              onChange={(e) => setForm({ ...form, doi: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publisher URL</label>
            <input
              type="url"
              value={form.publisherUrl}
              onChange={(e) => setForm({ ...form, publisherUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Abstract</label>
            <textarea
              rows={3}
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
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
              Featured Publication
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Publication" : "Create Publication"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({
                    title: "",
                    authorsStr: "",
                    journal: "",
                    year: new Date().getFullYear(),
                    type: "journal-article",
                    status: "published",
                    doi: "",
                    publisherUrl: "",
                    abstract: "",
                    featured: false,
                  });
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
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Publications List</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : pubs.length === 0 ? (
          <p className="text-sm text-gray-500">No publications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Journal</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pubs.map((p) => (
                  <tr key={String(p._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(p.title)}</td>
                    <td className="p-3 text-gray-600">{String(p.journal)}</td>
                    <td className="p-3">{Number(p.year)}</td>
                    <td className="p-3 capitalize">{String(p.status)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-[#0E7C7B] hover:underline font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(String(p._id))} className="text-red-600 hover:underline font-medium">
                        Delete
                      </button>
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
