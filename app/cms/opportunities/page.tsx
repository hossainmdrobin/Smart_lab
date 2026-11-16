"use client";

import { useState } from "react";
import {
  useGetOpportunitiesQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} from "@/src/lib/services/rtk/opportunitiesApi";
import Card from "@/components/ui/Card";

export default function CmsOpportunitiesPage() {
  const { data: opps = [], isLoading } = useGetOpportunitiesQuery();
  const [createOpp] = useCreateOpportunityMutation();
  const [updateOpp] = useUpdateOpportunityMutation();
  const [deleteOpp] = useDeleteOpportunityMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eligibility: "",
    location: "Dhaka, Bangladesh",
    applicationInstructions: "",
    status: "open",
    deadline: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isEditing) {
        await updateOpp({ id: isEditing, data: form }).unwrap();
        setIsEditing(null);
      } else {
        await createOpp(form).unwrap();
      }
      setForm({ title: "", description: "", eligibility: "", location: "Dhaka, Bangladesh", applicationInstructions: "", status: "open", deadline: "" });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(o: Record<string, unknown>) {
    setIsEditing(o._id as string);
    const deadlineVal = o.deadline ? String(o.deadline).substring(0, 10) : "";
    setForm({
      title: (o.title as string) || "",
      description: (o.description as string) || "",
      eligibility: (o.eligibility as string) || "",
      location: (o.location as string) || "Dhaka, Bangladesh",
      applicationInstructions: (o.applicationInstructions as string) || "",
      status: (o.status as string) || "open",
      deadline: deadlineVal,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete opportunity?")) return;
    try {
      await deleteOpp(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Opportunities Management</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit Opportunity" : "Add Opportunity"}
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eligibility</label>
            <input
              type="text"
              required
              value={form.eligibility}
              onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
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
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Application Instructions</label>
            <textarea
              rows={2}
              required
              value={form.applicationInstructions}
              onChange={(e) => setForm({ ...form, applicationInstructions: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Opportunity" : "Create Opportunity"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({ title: "", description: "", eligibility: "", location: "Dhaka, Bangladesh", applicationInstructions: "", status: "open", deadline: "" });
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
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Opportunities List</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : opps.length === 0 ? (
          <p className="text-sm text-gray-500">No opportunities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {opps.map((o) => (
                  <tr key={String(o._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(o.title)}</td>
                    <td className="p-3 capitalize">{String(o.status)}</td>
                    <td className="p-3">{o.deadline ? new Date(String(o.deadline)).toLocaleDateString() : "—"}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(o)} className="text-[#0E7C7B] hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(String(o._id))} className="text-red-600 hover:underline font-medium">Delete</button>
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
