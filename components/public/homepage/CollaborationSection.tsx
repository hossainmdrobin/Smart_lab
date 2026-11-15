import Link from "next/link";

import Card from "@/components/ui/Card";

export default function CollaborationSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <Card className="relative overflow-hidden border-0 bg-[#10243A] p-8 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0E7C7B]/20" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#55C6D8]/10" />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight">
            Let’s Advance Research Together
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            We welcome inquiries about research collaboration in computational
            life sciences and drug discovery.
          </p>

          <div className="mt-7">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#0E7C7B] px-6 py-3 text-sm font-semibold text-[#10243A] hover:bg-[#13B8A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
            >
              Contact the Laboratory
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
