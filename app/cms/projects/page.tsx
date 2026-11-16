"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/src/lib/services/rtk/projectsApi";
import { useGetResearchThemesQuery } from "@/src/lib/services/rtk/researchThemesApi";
import Card from "@/components/ui/Card";

export default function CmsProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const { data: themes = [] } = useGetResearchThemesQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    researchTheme: [] as string[],
    status: "ongoing",
    codeUrl: "",
    datasetUrl: "",
    featured: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (form.researchTheme.length === 0) {
        throw new Error("Select at least one research theme");
      }
      if (isEditing) {
        await updateProject({ id: isEditing, data: form }).unwrap();
        setIsEditing(null);
      } else {
        await createProject(form).unwrap();
      }
      setForm({ title: "", summary: "", researchTheme: [], status: "ongoing", codeUrl: "", datasetUrl: "", featured: false });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || (err instanceof Error ? err.message : "Failed to save project");
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(p: Record<string, unknown>) {
    setIsEditing(p._id as string);
    const rawThemes = (p.researchTheme as Array<Record<string, unknown> | string>) || [];
    const themeIds = rawThemes.map((t) => (typeof t === "object" && t !== null ? String(t._id) : String(t)));
    setForm({
      title: (p.title as string) || "",
      summary: (p.summary as string) || "",
      researchTheme: themeIds,
      status: (p.status as string) || "ongoing",
      codeUrl: (p.codeUrl as string) || "",
      datasetUrl: (p.datasetUrl as string) || "",
      featured: (p.featured as boolean) || false,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete project?")) return;
    try {
      await deleteProject(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Projects Management</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit Project" : "Add Project"}
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
              rows={3}
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
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
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Research Theme</label>
            <select
              value={form.researchTheme[0] || ""}
              onChange={(e) => setForm({ ...form, researchTheme: [e.target.value] })}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            >
              <option value="">Select Theme...</option>
              {themes.map((t) => (
                <option key={String(t._id)} value={String(t._id)}>{String(t.name)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code URL</label>
            <input
              type="url"
              value={form.codeUrl}
              onChange={(e) => setForm({ ...form, codeUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dataset URL</label>
            <input
              type="url"
              value={form.datasetUrl}
              onChange={(e) => setForm({ ...form, datasetUrl: e.target.value })}
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
              Featured Project
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Project" : "Create Project"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({ title: "", summary: "", researchTheme: [], status: "ongoing", codeUrl: "", datasetUrl: "", featured: false });
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
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Projects List</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-500">No projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((p) => (
                  <tr key={String(p._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(p.title)}</td>
                    <td className="p-3 capitalize">{String(p.status)}</td>
                    <td className="p-3">{p.featured ? "Yes" : "No"}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-[#0E7C7B] hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(String(p._id))} className="text-red-600 hover:underline font-medium">Delete</button>
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
