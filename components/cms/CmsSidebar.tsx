"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { setMobileSidebarOpen, toggleMobileSidebar } from "@/src/lib/redux/slices/uiSlice";

interface SidebarItem {
  href: string;
  label: string;
}

interface CmsSidebarProps {
  items: SidebarItem[];
}

export default function CmsSidebar({ items }: CmsSidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const drawerOpen = useAppSelector((state) => state.ui.mobileSidebarOpen);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => {
    dispatch(setMobileSidebarOpen(false));
    triggerRef.current?.focus();
  }, [dispatch]);

  useEffect(() => {
    if (!drawerOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeDrawer();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, closeDrawer]);

  const onDrawerNavigate = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute("href");
      if (href && href !== pathname) {
        dispatch(setMobileSidebarOpen(false));
      }
    },
    [pathname, dispatch],
  );

  return (
    <>
      {/* Mobile floating trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => dispatch(toggleMobileSidebar())}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#10243A] text-white shadow-lg lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
        aria-label={drawerOpen ? "Hide navigation menu" : "Show navigation menu"}
        aria-expanded={drawerOpen}
        aria-controls="cms-mobile-drawer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          {drawerOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          )}
        </svg>
      </button>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="cms-mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="CMS navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-200 ease-in-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-4">
          <span className="text-sm font-bold text-[#10243A]">CMS</span>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8]"
            aria-label="Close navigation menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <NavList items={items} pathname={pathname} onNavigate={onDrawerNavigate} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#E2E8F0] bg-white lg:block">
        <NavList items={items} pathname={pathname} />
      </aside>
    </>
  );
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: SidebarItem[];
  pathname: string;
  onNavigate?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <nav aria-label="CMS navigation">
      <ul className="flex flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] ${
                  isActive
                    ? "bg-[#F0FDFA] text-[#0E7C7B] border-l-2 border-[#0E7C7B]"
                    : "text-[#1E293B] hover:bg-[#F1F5F9] hover:text-[#10243A]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
