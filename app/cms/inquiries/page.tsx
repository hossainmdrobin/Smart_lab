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
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#10243A]">Contact Inquiries</h1>
      {errorMsg && <div className="rounded bg-red-50 p-3 text-xs sm:text-sm text-red-700">{errorMsg}</div>}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-[#10243A] mb-3 sm:mb-4">Inquiries List</h2>
            {isLoading ? (
              <p className="text-xs sm:text-sm text-gray-500">Loading...</p>
            ) : inquiries.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500">No contact inquiries found.</p>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-2 sm:p-3">Status</th>
                      <th className="p-2 sm:p-3">Sender</th>
                      <th className="p-2 sm:p-3">Subject</th>
                      <th className="p-2 sm:p-3">Received</th>
                      <th className="p-2 sm:p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inquiries.map((inq) => {
                      const isRead = Boolean(inq.isRead);
                      const id = String(inq._id);
                      const isSelected = selectedInquiry && selectedInquiry._id === id;
                      return (
                        <tr
                          key={id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            !isRead ? "bg-blue-50/50 font-semibold" : ""
                          } ${isSelected ? "bg-blue-100/60" : ""}`}
                          onClick={() => setSelectedInquiry(inq)}
                        >
                          <td className="p-2 sm:p-3 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                                isRead ? "bg-gray-100 text-gray-800" : "bg-[#0E7C7B]/10 text-[#0E7C7B]"
                              }`}
                            >
                              {isRead ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="p-2 sm:p-3 max-w-[150px] sm:max-w-xs truncate">
                            <div className="text-gray-900 truncate">{String(inq.name)}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 truncate">{String(inq.email)}</div>
                          </td>
                          <td className="p-2 sm:p-3 text-gray-800 max-w-[150px] sm:max-w-xs truncate">{String(inq.subject)}</td>
                          <td className="p-2 sm:p-3 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                            {inq.receivedAt ? new Date(String(inq.receivedAt)).toLocaleString() : "—"}
                          </td>
                          <td className="p-2 sm:p-3 text-right space-x-1 sm:space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleRead(id, isRead)}
                              className="text-[#0E7C7B] hover:underline text-[10px] sm:text-xs"
                            >
                              {isRead ? "Unread" : "Read"}
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              className="text-red-600 hover:underline text-[10px] sm:text-xs"
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
          <Card className="p-4 sm:p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-[#10243A]">Inquiry Details</h2>
              {selectedInquiry && (
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 lg:hidden"
                  aria-label="Close details"
                >
                  Close &times;
                </button>
              )}
            </div>
            {selectedInquiry ? (
              <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Name:</span> {String(selectedInquiry.name)}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>{" "}
                  <a href={`mailto:${selectedInquiry.email}`} className="text-[#0E7C7B] hover:underline break-all">
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
                  <div className="rounded-md bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap border border-gray-200 text-xs sm:text-sm">
                    {String(selectedInquiry.message)}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
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
              <p className="text-xs sm:text-sm text-gray-500">Select an inquiry from the list to view full details.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
