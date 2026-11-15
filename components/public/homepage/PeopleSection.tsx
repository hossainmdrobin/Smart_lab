import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

import Card from "@/components/ui/Card";

import type { SelectedPerson } from "@/src/lib/services/homepage";

function RoleLabel({ role }: { role: string }) {
  const text = role
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <span className="rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
      {text}
    </span>
  );
}

export default function PeopleSection({
  people,
}: {
  people: SelectedPerson[];
}) {
  if (!people || people.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
            Our Research Team
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Selected current laboratory members.
          </p>
        </div>
        <div>
          <Link
            href="/people"
            className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            View All Members
          </Link>
        </div>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-center gap-4">
              {p.photo?.url ? (
                <img
                  src={p.photo.url}
                  alt={p.photo.altText ?? `Photo of ${p.fullName}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-[72px] w-[72px] rounded-full border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center"
                >
                  <span className="text-[10px] font-semibold text-[#94A3B8]">
                    Photo
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#10243A]">
                  {p.fullName}
                </h3>
                <div className="mt-2">
                  <RoleLabel role={p.role} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href={`/people/${p.id}`}
                className="text-sm font-semibold text-[#10243A] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
              >
                View profile
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
