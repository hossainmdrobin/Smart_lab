"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  useGetContactInquiriesQuery,
  useUpdateContactInquiryMutation,
  useDeleteContactInquiryMutation,
} from "@/src/lib/services/rtk/contactApi";
import Card from "@/components/ui/Card";

export default function CmsInquiriesPage() {
  const { data: inquiries = [], isLoading } = useGetContactInquiriesQuery();
  const [updateInquiry] = useUpdateContactInquiryMutation();
  const [deleteInquiry] = useDeleteContactInquiryMutation();

  const [selectedInquiry, setSelectedInquiry] = useState<Record<string, unknown> | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleToggleRead(id: string, currentStatus: boolean) {
    setErrorMsg("");
    try {
      await updateInquiry({ id, data: { isRead: !currentStatus } }).unwrap();
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry({ ...selectedInquiry, isRead: !currentStatus });
      }
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to update status";
      setErrorMsg(errMsg);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this contact inquiry?")) return;
    setErrorMsg("");
    try {
      await deleteInquiry(id).unwrap();
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(null);
      }
    } catch (err: unknown) {
      const errMsg = (err as { data?: { error?: { message?: string } } })?.data?.error?.message || "Failed to delete inquiry";
      setErrorMsg(errMsg);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#10243A]">Contact Inquiries</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-[#10243A] mb-4">Inquiries List</h2>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : inquiries.length === 0 ? (
              <p className="text-sm text-gray-500">No contact inquiries found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Sender</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Received</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inquiries.map((inq) => {
                      const isRead = Boolean(inq.isRead);
                      const id = String(inq._id);
                      return (
                        <tr
                          key={id}
                          className={`hover:bg-gray-50 cursor-pointer ${!isRead ? "bg-blue-50/50 font-semibold" : ""}`}
                          onClick={() => setSelectedInquiry(inq)}
                        >
                          <td className="p-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                isRead ? "bg-gray-100 text-gray-800" : "bg-[#0E7C7B]/10 text-[#0E7C7B]"
                              }`}
                            >
                              {isRead ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-gray-900">{String(inq.name)}</div>
                            <div className="text-xs text-gray-500">{String(inq.email)}</div>
                          </td>
                          <td className="p-3 text-gray-800 max-w-xs truncate">{String(inq.subject)}</td>
                          <td className="p-3 text-xs text-gray-500">
                            {inq.receivedAt ? new Date(String(inq.receivedAt)).toLocaleString() : "—"}
                          </td>
                          <td className="p-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleRead(id, isRead)}
                              className="text-[#0E7C7B] hover:underline text-xs"
                            >
                              {isRead ? "Mark Unread" : "Mark Read"}
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              className="text-red-600 hover:underline text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-5 sticky top-6">
            <h2 className="text-lg font-semibold text-[#10243A] mb-4">Inquiry Details</h2>
            {selectedInquiry ? (
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Name:</span> {String(selectedInquiry.name)}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  <a href={`mailto:${selectedInquiry.email}`} className="text-[#0E7C7B] hover:underline">
                    {String(selectedInquiry.email)}
                  </a>
                </div>
                {selectedInquiry.institution ? (
                  <div>
                    <span className="font-semibold text-gray-700">Institution:</span> {String(selectedInquiry.institution)}
                  </div>
                ) : null}
                <div>
                  <span className="font-semibold text-gray-700">Subject:</span> {String(selectedInquiry.subject)}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Received:</span>{" "}
                  {selectedInquiry.receivedAt ? new Date(String(selectedInquiry.receivedAt)).toLocaleString() : "—"}
                </div>
                {selectedInquiry.ipAddress ? (
                  <div>
                    <span className="font-semibold text-gray-700">IP Address:</span> {String(selectedInquiry.ipAddress)}
                  </div>
                ) : null}
                <div className="mt-2">
                  <span className="font-semibold text-gray-700 block mb-1">Message:</span>
                  <div className="rounded-md bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap border border-gray-200">
                    {String(selectedInquiry.message)}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleToggleRead(String(selectedInquiry._id), Boolean(selectedInquiry.isRead))}
                    className="rounded-md bg-[#0E7C7B] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0b6564]"
                  >
                    {selectedInquiry.isRead ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(String(selectedInquiry._id))}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Delete Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select an inquiry from the list to view full details.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
