import type { Metadata } from "next";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import { getHomepageData } from "@/src/lib/services/homepage";

export const metadata: Metadata = {
  title: "Research | Laboratory of Algorithmic Life Sciences",
  description:
    "Explore our research areas in computational drug design, density functional theory (DFT), molecular docking, molecular dynamics, network pharmacology, and machine learning.",
};

const RESEARCH_THEMES = [
  {
    title: "Computational Drug Design",
    slug: "computational-drug-design",
    summary:
      "Structure- and ligand-based strategies to identify, evaluate, and optimize candidate molecules targeting biological pathways.",
    questions:
      "How can in silico screening methods efficiently prioritize molecular candidates from large compound libraries while minimizing false positives?",
    methods:
      "Ligand-based pharmacophore modeling, quantitative structure-activity relationship (QSAR) analysis, combinatorial library screening, and property-based optimization.",
  },
  {
    title: "Density Functional Theory (DFT)",
    slug: "quantum-chemical-modeling-dft",
    summary:
      "Quantum mechanical calculations investigating electronic structure, reaction mechanisms, and molecular stability at an atomic level.",
    questions:
      "What are the precise electronic distributions, transition states, and energetic profiles governing molecular stability and chemical reactivity?",
    methods:
      "Ab initio quantum chemical calculations, exchange-correlation functional evaluations, electrostatic potential mapping, and frontier molecular orbital analysis.",
  },
  {
    title: "Molecular Docking",
    slug: "molecular-docking",
    summary:
      "Predicting preferred orientation and binding affinities between small molecules and macromolecular targets.",
    questions:
      "How do small molecule ligands geometrically and energetically fit into active sites of macromolecular receptors?",
    methods:
      "Rigid and flexible docking algorithms, scoring function evaluation, binding pose clustering, and hydrogen bond network analysis.",
  },
  {
    title: "Molecular Dynamics (MD) Simulation",
    slug: "molecular-dynamics",
    summary:
      "Simulating physical movements of atoms and molecules over time to understand conformational dynamics and stability.",
    questions:
      "How do macromolecules fluctuate, undergo conformational changes, and maintain structural stability in dynamic biological environments?",
    methods:
      "All-atom and coarse-grained molecular dynamics simulations, free energy perturbation calculations, trajectory analysis, and principal component analysis (PCA).",
  },
  {
    title: "Network Pharmacology",
    slug: "network-pharmacology",
    summary:
      "Analyzing multi-target drug interactions and biological networks to understand complex therapeutic mechanisms.",
    questions:
      "How do multi-component therapeutic agents modulate complex intracellular signaling and metabolic networks?",
    methods:
      "Network topological analysis, target-pathway enrichment mapping, protein-protein interaction (PPI) network modeling, and systems-level synergy evaluation.",
  },
  {
    title: "Machine Learning & AI in Drug Discovery",
    slug: "machine-learning-ai",
    summary:
      "Data-driven predictive modeling and pattern recognition applied to large-scale biomedical and chemical datasets.",
    questions:
      "Can advanced machine learning architectures reliably predict molecular bioactivity, toxicity, and pharmacokinetic properties from chemical representations?",
    methods:
      "Graph neural networks, transformer-based molecular representations, deep learning regressors/classifiers, and rigorous cross-validation protocols.",
  },
];

export default async function ResearchPage() {
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
          <h1 className="text-4xl font-extrabold tracking-tight text-[#10243A]">
            Research Themes
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#64748B]">
            The Laboratory of Algorithmic Life Sciences investigates complex biological and chemical systems through rigorous computational methodologies across seven core research areas.
          </p>
        </header>

        <div className="space-y-12">
          {RESEARCH_THEMES.map((theme, index) => (
            <Card key={theme.slug} className="p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F4F5] px-3 py-1 text-xs font-semibold text-[#0E7C7B]">
                    Research Theme {index + 1}
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#10243A]">
                    {theme.title}
                  </h2>
                  <p className="text-base leading-relaxed text-[#475569]">
                    {theme.summary}
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-[#E2E8F0]">
                    <div className="rounded-xl bg-[#F5F8FA] p-4 border border-[#E2E8F0]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#10243A]">
                        Core Scientific Question
                      </h3>
                      <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                        {theme.questions}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F5F8FA] p-4 border border-[#E2E8F0]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#10243A]">
                        Computational Methods
                      </h3>
                      <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                        {theme.methods}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Editorial Disclaimer */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-amber-900 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Important Scientific Notice & Editorial Disclaimer
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-amber-800">
              All computational predictions, molecular models, binding affinities, and algorithmic evaluations generated by the laboratory serve to guide hypothesis generation, academic inquiry, and foundational discovery. Computational screening and simulation alone do not establish clinical effectiveness, therapeutic safety, or biological proven efficacy.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter settings={homepageData.settings} />
    </div>
  );
}
