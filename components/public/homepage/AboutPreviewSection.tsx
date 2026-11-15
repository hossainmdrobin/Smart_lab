import Image from "next/image";
import Link from "next/link";

import Card from "@/components/ui/Card";

export default function AboutPreviewSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
            About Our Laboratory
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#1E293B]">
            To investigate molecular and biological systems through
            computational methods and develop research that supports drug
            discovery and advances understanding in the life sciences.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#64748B]">
            Our research philosophy emphasizes methodological clarity,
            reproducible analysis, and careful interpretation of computational
            results.
          </p>

          <div className="mt-7">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-[#10243A] bg-transparent px-5 py-3 text-sm font-semibold text-[#10243A] hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div>
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="text-sm font-semibold text-[#64748B]">
                Scientific approach (visual pending)
              </div>
            </div>
            <div className="relative">
              <Image
                src="/molecular-visualization.svg"
                alt="Scientific visual placeholder representing molecular interactions (content pending approval)"
                width={1000}
                height={700}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
