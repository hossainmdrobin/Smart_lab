"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/src/lib/services/rtk/usersApi";
import Card from "@/components/ui/Card";

export default function CmsUsersPage() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
    isActive: true,
  });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (isEditing) {
        const payload: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await updateUser({ id: isEditing, data: payload }).unwrap();
        setIsEditing(null);
      } else {
        await createUser(form).unwrap();
      }
      setForm({ name: "", email: "", password: "", role: "editor", isActive: true });
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to save user";
      setErrorMsg(errMsg);
    }
  }

  function handleEdit(u: Record<string, unknown>) {
    setIsEditing(u._id as string);
    setForm({
      name: (u.name as string) || "",
      email: (u.email as string) || "",
      password: "",
      role: (u.role as string) || "editor",
      isActive: (u.isActive as boolean) ?? true,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete user account?")) return;
    try {
      await deleteUser(id).unwrap();
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed";
      alert(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Users Management (Admin Only)</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}
      {error && <div className="rounded bg-red-50 p-3 text-sm text-red-700">Access denied or failed to load users. Admin role required.</div>}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">
          {isEditing ? "Edit User" : "Create New User"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password {isEditing && "(leave blank to keep)"}</label>
            <input
              type="password"
              {...(!isEditing ? { required: true } : {})}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0E7C7B]"
              />
              Active Account
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#0E7C7B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b6564]"
            >
              {isEditing ? "Update User" : "Create User"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setForm({ name: "", email: "", password: "", role: "editor", isActive: true });
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
        <h2 className="text-lg font-semibold text-[#10243A] mb-4">System Users</h2>
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={String(u._id)} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{String(u.name)}</td>
                    <td className="p-3 text-gray-600">{String(u.email)}</td>
                    <td className="p-3 capitalize font-semibold">{String(u.role)}</td>
                    <td className="p-3">{u.isActive ? "Active" : "Inactive"}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(u)} className="text-[#0E7C7B] hover:underline font-medium">Edit</button>
                      <button onClick={() => handleDelete(String(u._id))} className="text-red-600 hover:underline font-medium">Delete</button>
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
