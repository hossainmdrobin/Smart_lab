import { Suspense } from "react";

export const dynamic = "force-dynamic";

import { requireUser } from "@/src/lib/auth/server";
import { dbConnect } from "@/src/lib/db/connect";
import { ContactInquiry } from "@/src/models/ContactInquiry";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

async function CmsDashboardInner() {
  const user = await requireUser({ allowedRoles: ["admin", "editor"] });

  await dbConnect();
  const unreadCount = await ContactInquiry.countDocuments({ isRead: false });
  const totalCount = await ContactInquiry.countDocuments();
  const recentInquiries = await ContactInquiry.find().sort({ receivedAt: -1 }).limit(5).lean().exec();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#10243A]">Dashboard</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#64748B]">
          Signed in as <span className="font-semibold">{user.name}</span> ({user.role}).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Unread Inquiries</h3>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-[#0E7C7B]">{unreadCount}</p>
          <a href="/cms/inquiries" className="mt-2 sm:mt-3 inline-block text-xs sm:text-sm font-medium text-[#0E7C7B] hover:underline">
            View inquiries &rarr;
          </a>
        </Card>
        <Card className="p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Inquiries</h3>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{totalCount}</p>
          <a href="/cms/inquiries" className="mt-2 sm:mt-3 inline-block text-xs sm:text-sm font-medium text-[#0E7C7B] hover:underline">
            Manage inquiries &rarr;
          </a>
        </Card>
        <Card className="p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Quick Actions</h3>
          <div className="mt-2 sm:mt-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              href="/cms/change-password"
              ariaLabel="Change password"
            >
              Change password
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-[#10243A] mb-3 sm:mb-4">Recent Contact Inquiries</h2>
          {recentInquiries.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500">No contact inquiries received yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="p-2 sm:p-3">Status</th>
                    <th className="p-2 sm:p-3">Sender</th>
                    <th className="p-2 sm:p-3">Subject</th>
                    <th className="p-2 sm:p-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentInquiries.map((inq) => {
                    const isRead = Boolean(inq.isRead);
                    return (
                      <tr key={String(inq._id)} className="hover:bg-gray-50">
                        <td className="p-2 sm:p-3 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                              isRead ? "bg-gray-100 text-gray-800" : "bg-[#0E7C7B]/10 text-[#0E7C7B]"
                            }`}
                          >
                            {isRead ? "Read" : "Unread"}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 font-medium text-gray-900 max-w-[200px] sm:max-w-xs truncate">
                          {String(inq.name)} <span className="text-[10px] sm:text-xs font-normal text-gray-500 block sm:inline">({String(inq.email)})</span>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-800 max-w-[200px] sm:max-w-sm truncate">{String(inq.subject)}</td>
                        <td className="p-2 sm:p-3 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                          {inq.receivedAt ? new Date(String(inq.receivedAt)).toLocaleString() : "—"}
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
    </div>
  );
}

export default async function CmsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-[#10243A]">Dashboard</h1>
            <p className="mt-2 text-sm text-[#64748B]">Loading...</p>
          </div>
        </div>
      }
    >
      <CmsDashboardInner />
    </Suspense>
  );
}
