import Link from "next/link";
import type { ReactNode } from "react";

const AREAS: Array<{
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}> = [
  {
    title: "Computational Drug Design",
    description:
      "In silico strategies to support the exploration of molecular candidates, including target-driven modeling and structure-based analysis.",
    href: "/research?theme=computational-drug-design",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M9 3h6v2h2v16H7V5h2V3Zm1 5v10h4V8h-4Zm-3-3v2h10V5H7Z"
        />
      </svg>
    ),
  },
  {
    title: "Quantum Chemical Modeling & DFT",
    description:
      "Electronic-structure calculations to study molecular properties and reaction-relevant energetics with density functional theory.",
    href: "/research?theme=quantum-chemical-modeling-dft",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Zm0 3.2L7 7.6v5.1c0 3.4 2 6.4 5 7 3-.6 5-3.6 5-7V7.6l-5-2.4Z"
        />
      </svg>
    ),
  },
  {
    title: "Molecular Docking",
    description:
      "Structure-based docking and scoring workflows used to analyze potential binding modes and compare candidate interactions.",
    href: "/research?theme=molecular-docking",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M10 4h4l1 5h4l-3 3 2 8-7-5-7 5 2-8-3-3h4l1-5Z"
        />
      </svg>
    ),
  },
  {
    title: "Molecular Dynamics Simulation",
    description:
      "Simulation-based analysis of molecular motion to study stability, conformational dynamics, and interaction behavior over time.",
    href: "/research?theme=molecular-dynamics",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 2c5 0 9 4.5 9 10s-4 10-9 10S3 17.5 3 12 7 2 12 2Zm1 5h-2v5l4 2 1-1.7-3-1.3V7Z"
        />
      </svg>
    ),
  },
  {
    title: "Network Pharmacology",
    description:
      "Network-level analysis linking molecular interactions, targets, and pathways to support hypothesis generation in drug discovery.",
    href: "/research?theme=network-pharmacology",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M7 7a2 2 0 1 0 0.001 0ZM17 17a2 2 0 1 0 0.001 0ZM17 7a2 2 0 1 0 0.001 0ZM7 17a2 2 0 1 0 0.001 0ZM8.7 8.7l6.6 6.6 1.4-1.4-6.6-6.6-1.4 1.4ZM15.3 8.7l-6.6 6.6 1.4 1.4 6.6-6.6-1.4-1.4Z"
        />
      </svg>
    ),
  },
  {
    title: "Machine Learning & AI in Drug Discovery",
    description:
      "Data-driven modeling approaches to analyze molecular features and support research workflows, including prediction and interpretation tasks.",
    href: "/research?theme=machine-learning-ai",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#0E7C7B]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 2l3 5-3 5-3-5 3-5Zm0 9l3 5-3 5-3-5 3-5Z"
        />
      </svg>
    ),
  },
];

export default function ResearchAreasSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
          Research Areas
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[#64748B]">
          Computational approaches to understanding molecular systems and
          advancing drug discovery research.
        </p>
      </div>

      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => (
          <article
            key={area.title}
            className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{area.icon}</div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#10243A]">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                  {area.description}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href={area.href}
                className="text-sm font-semibold text-[#0E7C7B] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2 rounded-md"
              >
                Explore Research
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
