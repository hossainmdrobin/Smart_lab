import Link from "next/link";

import Button from "@/components/ui/Button";
import HeroMolecularVisual from "./HeroMolecularVisual";
import HeroMethodStrip from "./HeroMethodStrip";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B192C] text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      >
        <source src="/bg_video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for contrast and readability */}
      <div className="absolute inset-0 bg-[#0B192C]/85 backdrop-blur-[1px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-slate-900/80 px-4 py-1.5 shadow-sm backdrop-blur">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#0D9488]"
              />
              <span className="text-xs font-semibold tracking-wider text-teal-300">
                LABORATORY OF ALGORITHMIC LIFE SCIENCES &bull; DHAKA, BANGLADESH
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Advancing Drug Discovery Through Computation
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              The Laboratory of Algorithmic Life Sciences is a computational
              research laboratory based in Dhaka, Bangladesh. Our work brings
              together computational drug design, density functional theory,
              molecular docking, molecular dynamics simulation, network
              pharmacology, machine learning, and artificial intelligence to
              investigate molecular systems and support drug discovery research.
            </p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Button
                href="/research"
                variant="primary"
                className="bg-[#0D9488] text-white hover:bg-[#0B7A70]"
              >
                Explore Our Research
              </Button>
              <Button
                href="/publications"
                variant="secondary"
                className="border-slate-600 text-white hover:bg-slate-800"
              >
                View Publications
              </Button>
            </div>

            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#06B6D4] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 rounded-md"
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
      </div>
    </section>
  );
}
