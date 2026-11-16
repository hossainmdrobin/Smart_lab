import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import { getPersonDetailData } from "@/src/lib/services/people";

/* eslint-disable @next/next/no-img-element */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { person } = await getPersonDetailData(id);

  if (!person) {
    return {
      title: "Person Not Found | Laboratory of Algorithmic Life Sciences",
    };
  }

  return {
    title: `${person.fullName} | Laboratory of Algorithmic Life Sciences`,
    description: person.bio || `${person.fullName} - ${person.role} at the Laboratory of Algorithmic Life Sciences.`,
  };
}

function RoleLabel({ role }: { role: string }) {
  const displayMap: Record<string, string> = {
    "principal-investigator": "Principal Investigator",
    "senior-research-associate": "Senior Research Associate",
    "research-associate": "Research Associate",
    "research-assistant": "Research Assistant",
    "student-trainee": "Student & Trainee",
    "collaborator": "Collaborator",
    "alumni": "Alumni",
  };
  const text = displayMap[role] || role.split("-").map((w) => w.slice(0, 1).toUpperCase() + w.slice(1)).join(" ");
  return (
    <span className="inline-block rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3.5 py-1 text-sm font-semibold text-[#64748B]">
      {text}
    </span>
  );
}

export default async function PersonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { settings, person } = await getPersonDetailData(id);

  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-full bg-[#F5F8FA] text-[#1E293B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#10243A]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/people"
            className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            &larr; Back to Research Team
          </Link>
        </div>

        <Card className="overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {person.photo?.url ? (
              <img
                src={person.photo.url}
                alt={person.photo.altText ?? `Photo of ${person.fullName}`}
                width={160}
                height={160}
                className="h-40 w-40 rounded-2xl object-cover shadow-md shrink-0 mx-auto md:mx-0"
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-40 w-40 rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center shrink-0 mx-auto md:mx-0 shadow-sm"
              >
                <span className="text-sm font-semibold text-[#94A3B8]">No Photo</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold text-[#10243A]">
                  {person.fullName}
                </h1>
                <RoleLabel role={person.role} />
                {person.status === "alumni" ? (
                  <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#D97706]">
                    Alumni
                  </span>
                ) : null}
              </div>

              {person.education ? (
                <p className="mt-3 text-base text-[#475569] font-medium">
                  {person.education}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold">
                {person.email ? (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#E6F4F8] px-3.5 py-2 text-[#0E7C7B] hover:bg-[#D5EEF4]"
                  >
                    Contact Email
                  </a>
                ) : null}
                {person.orcid ? (
                  <a
                    href={person.orcid.startsWith("http") ? person.orcid : `https://orcid.org/${person.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-[#10243A] hover:bg-[#F8FAFC]"
                  >
                    ORCID Profile
                  </a>
                ) : null}
                {person.googleScholar ? (
                  <a
                    href={person.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-[#10243A] hover:bg-[#F8FAFC]"
                  >
                    Google Scholar
                  </a>
                ) : null}
                {person.github ? (
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-[#10243A] hover:bg-[#F8FAFC]"
                  >
                    GitHub
                  </a>
                ) : null}
                {person.personalWebsite ? (
                  <a
                    href={person.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-[#10243A] hover:bg-[#F8FAFC]"
                  >
                    Personal Website
                  </a>
                ) : null}
                {person.cv?.url ? (
                  <a
                    href={person.cv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#10243A] px-3.5 py-2 text-white hover:bg-[#1E3A5F]"
                  >
                    Download CV
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {person.bio ? (
            <div className="mt-10 border-t border-[#E2E8F0] pt-8">
              <h2 className="text-xl font-bold text-[#10243A] mb-4">Biography</h2>
              <div className="prose text-[#475569] leading-relaxed whitespace-pre-line">
                {person.bio}
              </div>
            </div>
          ) : null}

          {person.researchInterests.length > 0 ? (
            <div className="mt-10 border-t border-[#E2E8F0] pt-8">
              <h2 className="text-xl font-bold text-[#10243A] mb-4">Research Interests</h2>
              <div className="flex flex-wrap gap-2">
                {person.researchInterests.map((ri) => (
                  <span
                    key={ri.id}
                    className="rounded-lg bg-[#E6F4F8] px-3 py-1.5 text-sm font-medium text-[#0E7C7B]"
                  >
                    {ri.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {person.selectedPublications.length > 0 ? (
            <div className="mt-10 border-t border-[#E2E8F0] pt-8">
              <h2 className="text-xl font-bold text-[#10243A] mb-4">Selected Publications</h2>
              <ul className="space-y-4">
                {person.selectedPublications.map((pub) => (
                  <li key={pub.id} className="rounded-lg border border-[#E2E8F0] p-4 bg-[#F8FAFC]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-[#10243A]">{pub.title}</h3>
                        <p className="mt-1 text-sm text-[#64748B]">
                          {pub.journal} ({pub.year}) &bull; <span className="uppercase text-xs font-bold text-[#0E7C7B]">{pub.type}</span>
                        </p>
                      </div>
                      {pub.publisherUrl || pub.doi ? (
                        <a
                          href={pub.publisherUrl || `https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[#0E7C7B] hover:underline shrink-0"
                        >
                          View &rarr;
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
