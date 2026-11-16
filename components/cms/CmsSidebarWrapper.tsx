"use client";

import { usePathname } from "next/navigation";

import CmsSidebar from "@/components/cms/CmsSidebar";

const SIDEBAR_ITEMS = [
  { href: "/cms/dashboard", label: "Dashboard" },
  { href: "/cms/people", label: "People" },
  { href: "/cms/publications", label: "Publications" },
  { href: "/cms/projects", label: "Projects" },
  { href: "/cms/research-themes", label: "Research Themes" },
  { href: "/cms/opportunities", label: "Opportunities" },
  { href: "/cms/news", label: "News & Updates" },
  { href: "/cms/media", label: "Media Library" },
  { href: "/cms/users", label: "Users" },
  { href: "/cms/settings", label: "Site Settings" },
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
