import { Suspense } from "react";

export const dynamic = "force-dynamic";

import { requireUser } from "@/src/lib/auth/server";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

async function CmsDashboardInner() {
  const user = await requireUser({ allowedRoles: ["admin", "editor"] });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243A]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Signed in as <span className="font-semibold">{user.name}</span> ({user.role}).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[#10243A]">Quick actions</h2>
          <p className="mt-2 text-sm text-[#64748B]">
            Change password and other CMS tools will be connected in later phases.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Button
              variant="secondary"
              href="/cms/change-password"
              ariaLabel="Change password"
            >
              Change password
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[#10243A]">Recent activity</h2>
          <p className="mt-2 text-sm text-[#64748B]">Placeholder for now.</p>
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
