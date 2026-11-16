"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetPeopleQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
} from "@/src/lib/services/rtk/peopleApi";
import Card from "@/components/ui/Card";
import ImageUploadField from "@/components/cms/ImageUploadField";

export default function CmsPeoplePage() {
  const { data: people = [], isLoading, error } = useGetPeopleQuery();
  const [createPerson] = useCreatePersonMutation();
  const [updatePerson] = useUpdatePersonMutation();
  const [deletePerson] = useDeletePersonMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    role: "research-associate",
    status: "current",
    bio: "",
    education: "",
    email: "",
    orcid: "",
    googleScholar: "",
    github: "",
    personalWebsite: "",
    order: 0,
    photo: "",
    cv: "",
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isEditing) {
        await updatePerson({ id: isEditing, data: form }).unwrap();
        setIsEditing(null);
      } else {
        await createPerson(form).unwrap();
      }
      setForm({
        fullName: "",
        role: "research-associate",
        status: "current",
        bio: "",
        education: "",
        email: "",
        orcid: "",
        googleScholar: "",
        github: "",
        personalWebsite: "",
        order: 0,
        photo: "",
        cv: "",
      });
      setPhotoUrl(null);
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to save person";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(person: Record<string, unknown>) {
    setIsEditing(person._id as string);
    const photoObj = person.photo as { _id?: string; url?: string } | undefined;
    setForm({
      fullName: (person.fullName as string) || "",
      role: (person.role as string) || "research-associate",
      status: (person.status as string) || "current",
      bio: (person.bio as string) || "",
      education: (person.education as string) || "",
      email: (person.email as string) || "",
      orcid: (person.orcid as string) || "",
      googleScholar: (person.googleScholar as string) || "",
      github: (person.github as string) || "",
      personalWebsite: (person.personalWebsite as string) || "",
      order: (person.order as number) || 0,
      photo: photoObj?._id || (typeof person.photo === "string" ? person.photo : ""),
      cv: "",
    });
    setPhotoUrl(photoObj?.url || null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this person?")) return;
    try {
      await deletePerson(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to delete";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">People / Team Management</h1>

      {errorMsg && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit Team Member" : "Add New Team Member"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            >
              <option value="principal-investigator">Principal Investigator</option>
              <option value="senior-research-associate">Senior Research Associate</option>
              <option value="research-associate">Research Associate</option>
              <option value="research-assistant">Research Assistant</option>
              <option value="student-trainee">Student / Trainee</option>
              <option value="collaborator">Collaborator</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            >
              <option value="current">Current</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Biography</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#0E7C7B] focus:ring-[#0E7C7B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <input
              type="text"
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
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
          <div className="sm:col-span-2">
            <ImageUploadField
              label="Profile Photo"
              value={form.photo}
              previewUrl={photoUrl || undefined}
              onChange={(mediaId, url) => {
                setForm({ ...form, photo: mediaId });
                setPhotoUrl(url);
              }}
              helperText="Upload profile photo (JPEG, PNG, WebP up to 5MB)"
            />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update Person" : "Create Person"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({
                    fullName: "",
                    role: "research-associate",
                    status: "current",
                    bio: "",
                    education: "",
                    email: "",
                    orcid: "",
                    googleScholar: "",
                    github: "",
                    personalWebsite: "",
                    order: 0,
                    photo: "",
                    cv: "",
                  });
                  setPhotoUrl(null);
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
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">Team Members</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load people</p>
        ) : people.length === 0 ? (
          <p className="text-sm text-gray-500">No team members found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {people.map((p) => (
                  <tr key={String(p._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(p.fullName)}</td>
                    <td className="p-3 capitalize">{String(p.role).replace("-", " ")}</td>
                    <td className="p-3 capitalize">{String(p.status)}</td>
                    <td className="p-3 text-gray-600">{p.email ? String(p.email) : "—"}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-[#0E7C7B] hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(String(p._id))}
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
