"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetResearchThemesQuery,
  useCreateResearchThemeMutation,
  useUpdateResearchThemeMutation,
  useDeleteResearchThemeMutation,
} from "@/src/lib/services/rtk/researchThemesApi";
import Card from "@/components/ui/Card";

export default function CmsResearchThemesPage() {
  const { data: themes = [], isLoading, error } = useGetResearchThemesQuery();
  const [createTheme] = useCreateResearchThemeMutation();
  const [updateTheme] = useUpdateResearchThemeMutation();
  const [deleteTheme] = useDeleteResearchThemeMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", featured: false, order: 0 });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isEditing) {
        await updateTheme({ id: isEditing, data: form }).unwrap();
        setIsEditing(null);
      } else {
        await createTheme(form).unwrap();
      }
      setForm({ name: "", slug: "", description: "", featured: false, order: 0 });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to save research theme";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(theme: Record<string, unknown>) {
    setIsEditing(theme._id as string);
    setForm({
      name: (theme.name as string) || "",
      slug: (theme.slug as string) || "",
      description: (theme.description as string) || "",
      featured: (theme.featured as boolean) || false,
      order: (theme.order as number) || 0,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this research theme?")) return;
    try {
      await deleteTheme(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to delete";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#10243A]">Research Themes Management</h1>
      </div>

      {errorMsg && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit Research Theme" : "Add New Research Theme"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug (URL-friendly)</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0E7C7B] focus:ring-[#0E7C7B]"
              />
              Featured Theme
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Theme" : "Create Theme"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({ name: "", slug: "", description: "", featured: false, order: 0 });
                }}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Existing Research Themes</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load research themes</p>
        ) : themes.length === 0 ? (
          <p className="text-sm text-gray-500">No research themes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {themes.map((theme) => (
                  <tr key={String(theme._id)} className="hover:bg-gray-50">
                    <td className="p-3">{Number(theme.order || 0)}</td>
                    <td className="p-3 font-medium text-gray-900">{String(theme.name)}</td>
                    <td className="p-3 text-gray-600">{String(theme.slug)}</td>
                    <td className="p-3">{theme.featured ? "Yes" : "No"}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(theme)}
                        className="text-[#0E7C7B] hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(String(theme._id))}
                        className="text-red-600 hover:underline font-medium"
                      >
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
