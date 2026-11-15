import Link from "next/link";

import Card from "@/components/ui/Card";

import type { FeaturedProject } from "@/src/lib/services/homepage";

/* eslint-disable @next/next/no-img-element */

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-xs font-semibold"
      style={{ color: status === "ongoing" || status === "completed" ? "#0E7C7B" : "#64748B" }}
    >
      {status.replaceAll("-", " ")}
    </span>
  );
}

export default function ProjectsSection({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
        Research Projects
      </h2>
      <p className="mt-3 text-base text-[#64748B]">
        Approved project summaries linked to research themes.
      </p>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {projects.map((proj) => (
          <Card key={proj.id} className="overflow-hidden">
            {proj.image?.url ? (
              <img
                src={proj.image.url}
                alt={proj.image.altText ?? "Project image (pending alt)"}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            ) : null}
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={proj.status} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#10243A]">
                {proj.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                {proj.summary}
              </p>

              {proj.researchThemeNames.length > 0 && (
                <div className="mt-4 text-sm text-[#64748B]">
                  <span className="font-semibold text-[#10243A]">
                    Research theme:
                  </span>{" "}
                  {proj.researchThemeNames[0]}
                </div>
              )}

              <div className="mt-5">
                <Link
                  href={`/projects/${proj.id}`}
                  className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
                >
                  View project
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
