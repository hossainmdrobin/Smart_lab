import Link from "next/link";

import Button from "@/components/ui/Button";
import HeroMolecularVisual from "./HeroMolecularVisual";
import HeroMethodStrip from "./HeroMethodStrip";

export default function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[#0D9488]"
            />
            <span className="text-xs font-semibold tracking-wider text-[#0B192C]">
              LABORATORY OF ALGORITHMIC LIFE SCIENCES &bull; DHAKA, BANGLADESH
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-[#0B192C] sm:text-5xl lg:text-6xl">
            Advancing Drug Discovery Through Computation
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            The Laboratory of Algorithmic Life Sciences is a computational
            research laboratory based in Dhaka, Bangladesh. Our work brings
            together computational drug design, density functional theory,
            molecular docking, molecular dynamics simulation, network
            pharmacology, machine learning, and artificial intelligence to
            investigate molecular systems and support drug discovery research.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Button href="/research" variant="primary">
              Explore Our Research
            </Button>
            <Button href="/publications" variant="secondary">
              View Publications
            </Button>
          </div>

          <div className="mt-5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 rounded-md"
            >
              Collaborate With Us &rarr;
            </Link>
          </div>

          <HeroMethodStrip />
        </div>

        <div>
          <HeroMolecularVisual />
        </div>
      </div>
    </section>
  );
}
