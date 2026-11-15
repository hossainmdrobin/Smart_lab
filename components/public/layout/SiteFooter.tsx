import Link from "next/link";
import type { ReactNode } from "react";

import type { HomepageSettings } from "@/src/lib/services/homepage";

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Research", href: "/#research" },
  { label: "People", href: "/#people" },
  { label: "Publications", href: "/#publications" },
  { label: "Opportunities", href: "/#contact" },
  { label: "Contact", href: "/#contact" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-[#64748B] hover:text-[#0E7C7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
    >
      {children}
    </Link>
  );
}

export default function SiteFooter({
  settings,
}: {
  settings: HomepageSettings;
}) {
  return (
    <footer className="mt-16 border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-bold text-[#10243A]">
              Laboratory of Algorithmic Life Sciences
            </div>
            <div className="mt-2 text-sm text-[#64748B]">
              Dhaka, Bangladesh
            </div>
            <div className="mt-3 text-sm text-[#64748B]">
              Contact:{" "}
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="font-semibold text-[#10243A] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
                >
                  {settings.contactEmail}
                </a>
              ) : (
                <span className="text-[#94A3B8]">To be confirmed</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-[#10243A]">Navigation</div>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-[#10243A]">Links</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {settings.socialLinks.length > 0 ? (
                settings.socialLinks.map((l) => (
                  <a
                    key={`${l.label}-${l.href}`}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#64748B] hover:text-[#0E7C7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
                  >
                    {l.label}
                  </a>
                ))
              ) : (
                <span className="text-sm text-[#94A3B8]">
                  Social links pending
                </span>
              )}
            </div>

            <div className="mt-6">
              {settings.privacyPolicyHref ? (
                <Link
                  href={settings.privacyPolicyHref}
                  className="text-sm font-medium text-[#64748B] hover:text-[#0E7C7B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
                >
                  Privacy Policy
                </Link>
              ) : (
                <span className="text-sm font-medium text-[#94A3B8]">
                  Privacy Policy (pending)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E2E8F0] pt-6 text-sm text-[#64748B]">
          © Laboratory of Algorithmic Life Sciences. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
