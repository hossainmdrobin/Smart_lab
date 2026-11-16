import type { Metadata } from "next";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";
import Card from "@/components/ui/Card";
import { getHomepageData } from "@/src/lib/services/homepage";

export const metadata: Metadata = {
  title: "About | Laboratory of Algorithmic Life Sciences",
  description:
    "Learn about the Laboratory of Algorithmic Life Sciences, our mission, vision, and computational research approach in Dhaka, Bangladesh.",
};

export default async function AboutPage() {
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
            About the Laboratory
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#64748B]">
            Based in Dhaka, Bangladesh, the Laboratory of Algorithmic Life Sciences investigates molecular and biological systems through advanced computational methods, bridging theory, simulation, and data-driven discovery.
          </p>
        </header>

        <div className="space-y-16">
          {/* Mission & Vision */}
          <section className="grid gap-8 md:grid-cols-2">
            <Card className="p-8 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-[#10243A]">
                Our Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                To investigate molecular and biological systems through computational methods and develop rigorous research that supports drug discovery and advances fundamental understanding in the life sciences.
              </p>
            </Card>

            <Card className="p-8 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-[#10243A]">
                Our Vision
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                To build a collaborative research environment connecting molecular modeling, quantum chemical calculations, biological networks, and machine learning approaches to address complex biomedical challenges.
              </p>
            </Card>
          </section>

          {/* Research Approach & Methodology */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-[#10243A]">
              Research Approach & Methodology
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              Our work integrates multiple complementary computational modalities. Rather than relying on a single isolated perspective, our investigations synthesize insights across several core areas:
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Computational Drug Design
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Structure- and ligand-based strategies to identify and optimize candidate molecules targeting biological pathways.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Density Functional Theory (DFT)
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Quantum mechanical calculations investigating electronic structure, reaction mechanisms, and molecular stability.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Molecular Docking
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Predicting preferred orientation and binding affinities between small molecules and macromolecular targets.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Molecular Dynamics (MD) Simulation
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Simulating physical movements of atoms and molecules to understand conformational dynamics and stability.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Network Pharmacology
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Analyzing multi-target drug interactions and biological networks to understand complex therapeutic mechanisms.
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Machine Learning & AI
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Data-driven predictive modeling and pattern recognition applied to large-scale biomedical datasets.
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm italic text-[#64748B]">
              Note: Computational predictions serve to guide hypothesis generation and discovery; they do not replace experimental validation or clinical confirmation.
            </p>
          </section>

          {/* Infrastructure & Environment */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-[#10243A]">
              Infrastructure & Computational Environment
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              The laboratory maintains computational infrastructure designed for high-performance molecular simulations, quantum chemical computations, and machine learning model training.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E2E8F0] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  High-Performance Computing Resources
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Hardware cluster configurations and GPU allocations: <span className="rounded bg-[#F1F5F9] px-2 py-0.5 text-xs font-semibold text-[#64748B]">To be confirmed</span>
                </p>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] p-6">
                <h3 className="text-base font-bold text-[#10243A]">
                  Institutional Affiliations & Partnerships
                </h3>
                <p className="mt-2 text-sm text-[#64748B]">
                  Collaborative networks and institutional partners: <span className="rounded bg-[#F1F5F9] px-2 py-0.5 text-xs font-semibold text-[#64748B]">To be confirmed</span>
                </p>
              </div>
            </div>
          </section>

          {/* Governance & Compliance */}
          <section className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748B]">
              Scientific Integrity & Compliance
            </h3>
            <p className="mt-2 text-xs text-[#64748B]">
              In strict adherence to laboratory policy, founding years, historical timelines, and unverified credentials are maintained as pending until officially confirmed. Computational findings are published transparently to support academic and scientific progress.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter settings={homepageData.settings} />
    </div>
  );
}
