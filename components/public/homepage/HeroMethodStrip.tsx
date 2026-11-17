import Link from "next/link";

const METHODS = [
  {
    name: "Computational Drug Design",
    href: "/research?theme=computational-drug-design",
  },
  {
    name: "DFT",
    href: "/research?theme=quantum-chemical-modeling-dft",
  },
  {
    name: "Molecular Docking",
    href: "/research?theme=molecular-docking",
  },
  {
    name: "Molecular Dynamics",
    href: "/research?theme=molecular-dynamics",
  },
  {
    name: "Network Pharmacology",
    href: "/research?theme=network-pharmacology",
  },
  {
    name: "AI & Machine Learning",
    href: "/research?theme=machine-learning-ai",
  },
] as const;

export default function HeroMethodStrip() {
  return (
    <div className="mt-10 border-t border-slate-200/80 pt-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Core Research Domains
      </p>
      <nav
        aria-label="Core Research Domains"
        className="mt-3 flex flex-wrap gap-2.5"
      >
        {METHODS.map((method) => (
          <Link
            key={method.name}
            href={method.href}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-[#0D9488] hover:bg-slate-50 hover:text-[#0D9488] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
          >
            {method.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
