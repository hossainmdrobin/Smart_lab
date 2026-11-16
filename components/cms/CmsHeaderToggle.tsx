"use client";

import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { toggleMobileSidebar } from "@/src/lib/redux/slices/uiSlice";

export default function CmsHeaderToggle() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleMobileSidebar())}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#10243A] shadow-sm hover:bg-gray-50 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8]"
      aria-label={isOpen ? "Hide navigation menu" : "Show navigation menu"}
      aria-expanded={isOpen}
      aria-controls="cms-mobile-drawer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}
