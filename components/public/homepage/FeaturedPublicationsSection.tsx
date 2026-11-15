import Link from "next/link";

import Card from "@/components/ui/Card";

import type { FeaturedPublication } from "@/src/lib/services/homepage";

function PublicationLink({ pub }: { pub: FeaturedPublication }) {
  if (pub.doi) {
    return (
      <a
        href={`https://doi.org/${pub.doi}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
      >
        DOI: {pub.doi}
      </a>
    );
  }

  if (pub.publisherUrl) {
    return (
      <a
        href={pub.publisherUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
      >
        Publisher link
      </a>
    );
  }

  return <span className="text-sm text-[#94A3B8]">DOI/publisher link unavailable</span>;
}

export default function FeaturedPublicationsSection({
  publications,
}: {
  publications: FeaturedPublication[];
}) {
  if (!publications || publications.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
            Selected Publications
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            A curated set of approved research outputs.
          </p>
        </div>
        <div>
          <Link
            href="/publications"
            className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
          >
            View All Publications
          </Link>
        </div>
      </div>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {publications.slice(0, 3).map((pub) => (
          <Card key={pub.id} className="p-6">
            <div className="text-xs font-semibold tracking-wide text-[#64748B]">
              {pub.year} • {pub.type.replaceAll("-", " ")}
            </div>
            <h3 className="mt-3 text-lg font-bold text-[#10243A]">
              {pub.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B] line-clamp-3">
              {pub.authors.join(", ")}
            </p>

            <div className="mt-4 text-sm text-[#64748B]">
              <span className="font-semibold text-[#10243A]">{pub.journal}</span>
            </div>

            <div className="mt-5">
              <PublicationLink pub={pub} />
            </div>

            <div className="mt-5">
              <Link
                href={`/publications/${pub.id}`}
                className="text-sm font-semibold text-[#10243A] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
              >
                View details
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
