import type { ReactNode } from "react";

import CmsSidebarWrapper from "@/components/cms/CmsSidebarWrapper";

export default function CmsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F8FA] text-[#1E293B]">
      <a
        href="#cms-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#10243A]"
      >
        Skip to content
      </a>
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <div className="text-sm font-bold text-[#10243A]">CMS</div>
            <div className="text-[12px] text-[#64748B]">Laboratory Access</div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <CmsSidebarWrapper />
        <main id="cms-main" className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
