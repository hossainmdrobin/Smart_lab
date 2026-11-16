import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import { getPeopleDirectoryData, type PublicPerson } from "@/src/lib/services/people";

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "Research Team & Members | Laboratory of Algorithmic Life Sciences",
  description:
    "Meet the researchers, leadership, students, and alumni of the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh.",
};

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
    <span className="inline-block rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
      {text}
    </span>
  );
}

function PersonCard({ person }: { person: PublicPerson }) {
  return (
    <Card className="flex flex-col justify-between p-6 transition-all hover:shadow-md">
      <div>
        <div className="flex items-start gap-4">
          {person.photo?.url ? (
            <img
              src={person.photo.url}
              alt={person.photo.altText ?? `Photo of ${person.fullName}`}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover shadow-sm shrink-0"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden="true"
              className="h-20 w-20 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center shrink-0"
            >
              <span className="text-xs font-semibold text-[#94A3B8]">Photo</span>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[#10243A] truncate">
              {person.fullName}
            </h3>
            <div className="mt-2">
              <RoleLabel role={person.role} />
            </div>
            {person.education ? (
              <p className="mt-2 text-xs text-[#64748B] line-clamp-1">
                {person.education}
              </p>
            ) : null}
          </div>
        </div>

        {person.bio ? (
          <p className="mt-4 text-sm text-[#475569] line-clamp-3">
            {person.bio}
          </p>
        ) : null}

        {person.researchInterests.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {person.researchInterests.map((ri) => (
              <span
                key={ri.id}
                className="rounded bg-[#E6F4F8] px-2 py-0.5 text-[11px] font-medium text-[#0E7C7B]"
              >
                {ri.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
        <Link
          href={`/people/${person.id}`}
          className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
        >
          View Full Profile &rarr;
        </Link>
        <div className="flex items-center gap-3 text-xs text-[#64748B]">
          {person.orcid ? (
            <a
              href={person.orcid.startsWith("http") ? person.orcid : `https://orcid.org/${person.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10243A] font-medium"
              aria-label={`${person.fullName}'s ORCID profile`}
            >
              ORCID
            </a>
          ) : null}
          {person.googleScholar ? (
            <a
              href={person.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10243A] font-medium"
              aria-label={`${person.fullName}'s Google Scholar profile`}
            >
              Scholar
            </a>
          ) : null}
          {person.github ? (
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10243A] font-medium"
              aria-label={`${person.fullName}'s GitHub profile`}
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default async function PeoplePage() {
  const { settings, people } = await getPeopleDirectoryData();

  const currentMembers = people.filter((p) => p.status === "current");
  const alumniMembers = people.filter((p) => p.status === "alumni");

  const principalInvestigators = currentMembers.filter((p) => p.role === "principal-investigator");
  const seniorResearchAssociates = currentMembers.filter((p) => p.role === "senior-research-associate");
  const researchAssociates = currentMembers.filter((p) => p.role === "research-associate");
  const researchAssistants = currentMembers.filter((p) => p.role === "research-assistant");
  const studentTrainees = currentMembers.filter((p) => p.role === "student-trainee");
  const collaborators = currentMembers.filter((p) => p.role === "collaborator");

  return (
    <div className="min-h-full bg-[#F5F8FA] text-[#1E293B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[#10243A]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-[#E2E8F0] pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#10243A]">
            Research Team & People
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#64748B]">
            Researchers, leadership, students, and collaborators at the Laboratory of Algorithmic Life Sciences dedicated to advancing computational biology and drug discovery in Dhaka, Bangladesh.
          </p>
        </header>

        {people.length === 0 ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#10243A]">Directory Content Pending</h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Team member profiles are currently being updated. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {principalInvestigators.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Principal Investigators
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {principalInvestigators.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {seniorResearchAssociates.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Senior Research Associates
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {seniorResearchAssociates.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {researchAssociates.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Research Associates & Postdoctoral Fellows
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {researchAssociates.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {researchAssistants.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Research Assistants
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {researchAssistants.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {studentTrainees.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Students & Trainees
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {studentTrainees.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {collaborators.length > 0 ? (
              <section>
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Collaborators
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {collaborators.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}

            {alumniMembers.length > 0 ? (
              <section className="border-t border-[#E2E8F0] pt-12">
                <h2 className="text-2xl font-bold text-[#10243A] tracking-tight mb-6">
                  Alumni & Former Members
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {alumniMembers.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
