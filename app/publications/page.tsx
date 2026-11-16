import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import { dbConnect } from "@/src/lib/db/connect";
import { Publication } from "@/src/models/Publication";
import { getHomepageData } from "@/src/lib/services/homepage";
import type { Types } from "mongoose";

export const metadata: Metadata = {
  title: "Publications | Laboratory of Algorithmic Life Sciences",
  description:
    "Peer-reviewed publications, reviews, and preprints from the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  let publications: Array<{
    _id: Types.ObjectId;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    volume?: string;
    issue?: string;
    pages?: string;
    doi?: string;
    publisherUrl?: string;
    type: string;
    abstract?: string;
  }> = [];

  try {
    await dbConnect();
    publications = (await Publication.find({
      status: "published",
      isDeleted: { $ne: true },
    })
      .select(
        "title authors journal year volume issue pages doi publisherUrl type abstract"
      )
      .sort({ year: -1, createdAt: -1 })
      .lean()
      .exec()) as typeof publications;
  } catch {
    publications = [];
  }

  const homepageData = await getHomepageData();

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#10243A]">
                Publications
              </h1>
              <p className="mt-3 max-w-3xl text-lg text-[#64748B]">
                Peer-reviewed research articles, reviews, and preprints from the Laboratory of Algorithmic Life Sciences.
              </p>
            </div>
          </div>
        </header>

        {publications.length === 0 ? (
          <Card className="p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#10243A]">
              No Publications Published Yet
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-md mx-auto">
              Verified publications and scholarly articles will be listed here as they are reviewed and published by laboratory researchers.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-[#0E7C7B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0b6564] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
              >
                Return to Home
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {publications.map((pub) => {
              const typeLabel =
                pub.type === "journal-article"
                  ? "Journal Article"
                  : pub.type === "review"
                  ? "Review"
                  : pub.type === "preprint"
                  ? "Preprint"
                  : "Other";

              return (
                <Card key={String(pub._id)} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#E6F4F5] px-3 py-0.5 text-xs font-semibold text-[#0E7C7B]">
                          {typeLabel}
                        </span>
                        <span className="text-xs font-semibold text-[#64748B]">
                          {pub.year}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight text-[#10243A]">
                        {pub.title}
                      </h2>

                      <p className="text-sm font-medium text-[#475569]">
                        {pub.authors.join(", ")}
                      </p>

                      <p className="text-sm italic text-[#64748B]">
                        {pub.journal}
                        {pub.volume && ` ${pub.volume}`}
                        {pub.issue && `(${pub.issue})`}
                        {pub.pages && `: ${pub.pages}`}
                      </p>

                      {pub.abstract && (
                        <p className="text-sm text-[#475569] leading-relaxed pt-2">
                          {pub.abstract}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-3">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E7C7B] hover:underline"
                          >
                            DOI: {pub.doi}
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}

                        {pub.publisherUrl && (
                          <a
                            href={pub.publisherUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E7C7B] hover:underline"
                          >
                            Publisher Link
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter settings={homepageData.settings} />
    </div>
  );
}
