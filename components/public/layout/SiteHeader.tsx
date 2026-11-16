"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/components/ui/cn";

const NAV_ITEMS: Array<{ label: string; href: string; key: string }> = [
  { label: "Home", href: "/", key: "home" },
  { label: "About", href: "/about", key: "about" },
  { label: "Research", href: "/research", key: "research" },
  { label: "People", href: "/people", key: "people" },
  { label: "Publications", href: "/publications", key: "publications" },
  { label: "Contact", href: "/contact", key: "contact" },
];

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          aria-label="Laboratory of Algorithmic Life Sciences home"
        >
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]"
          >
            <span className="text-[10px] font-semibold text-[#64748B]">
              Logo
            </span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-[#10243A]">
              Laboratory of Algorithmic Life Sciences
            </div>
            <div className="text-[12px] text-[#64748B]">Dhaka, Bangladesh</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-[#10243A] hover:text-[#0E7C7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md",
                  isActive && "underline decoration-[#0E7C7B] underline-offset-4",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#10243A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
            aria-label="Open navigation menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="absolute right-0 top-0 h-full w-[90%] max-w-sm overflow-y-auto border-l border-[#E2E8F0] bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-[#10243A]">
                Navigation
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#10243A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-3" aria-label="Main">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-semibold text-[#10243A] hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2",
                      isActive && "bg-[#F1F5F9] text-[#0E7C7B]",
                    )}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
