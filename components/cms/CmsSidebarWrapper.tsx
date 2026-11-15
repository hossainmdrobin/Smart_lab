"use client";

import { usePathname } from "next/navigation";

import CmsSidebar from "@/components/cms/CmsSidebar";

const SIDEBAR_ITEMS = [
  { href: "/cms/dashboard", label: "Dashboard" },
  { href: "/cms/change-password", label: "Change password" },
];

const HIDDEN_ROUTES = new Set([
  "/cms/login",
  "/cms/forgot-password",
  "/cms/reset-password",
]);

export default function CmsSidebarWrapper() {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.has(pathname)) {
    return null;
  }

  return <CmsSidebar items={SIDEBAR_ITEMS} />;
}
