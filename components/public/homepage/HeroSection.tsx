import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 sm:pt-14">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#0E7C7B]"
            />
            <span className="text-sm font-semibold text-[#10243A]">
              Dhaka, Bangladesh
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#10243A] sm:text-5xl">
            Advancing Drug Discovery Through Computation
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#1E293B]">
            The Laboratory of Algorithmic Life Sciences is a computational
            research laboratory based in Dhaka, Bangladesh. Our work brings
            together computational drug design, density functional theory,
            molecular docking, molecular dynamics simulation, network
            pharmacology, machine learning, and artificial intelligence to
            investigate molecular systems and support drug discovery research.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/research" variant="primary">
              Explore Our Research
            </Button>
            <Button href="/publications" variant="secondary">
              View Publications
            </Button>
          </div>

          <div className="mt-4">
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
            >
              Collaborate With Us
            </Link>
          </div>
        </div>

        <div>
          <Card className="relative overflow-hidden">
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-[#64748B]">
              Image pending approval
            </div>
            <Image
              src="/molecular-visualization.svg"
              alt="Molecular visualization representing computational interactions (content pending approval)"
              width={1000}
              height={800}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
