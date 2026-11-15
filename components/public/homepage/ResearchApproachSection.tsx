export default function ResearchApproachSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-[#10243A]">
          Research Approach
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[#64748B]">
          Different computational approaches can support research insight.
          These are related methods—not every approach is required for every
          project.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <div className="mx-auto max-w-5xl">
          <svg
            viewBox="0 0 900 420"
            className="h-auto w-full"
            role="img"
            aria-label="Diagram showing related computational research approaches"
          >
            <defs>
              <linearGradient id="teal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#13B8A6" stopOpacity="0.9" />
                <stop offset="1" stopColor="#55C6D8" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Nodes */}
            {[{
              x: 90,
              y: 120,
              t: "Molecular\nsystem investigation",
            },
            {
              x: 350,
              y: 70,
              t: "Computational\nmodeling",
            },
            {
              x: 560,
              y: 120,
              t: "Molecular\ninteraction analysis",
            },
            {
              x: 350,
              y: 220,
              t: "Simulation\nand data analysis",
            },
            {
              x: 90,
              y: 260,
              t: "Research\ninterpretation",
            },
            {
              x: 610,
              y: 260,
              t: "Scientific\nquestions",
            }].map((n) => {
              return (
                <g key={n.x}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={240}
                    height={92}
                    rx={16}
                    fill="#F1F5F9"
                    stroke="#E2E8F0"
                  />
                  <text
                    x={n.x + 20}
                    y={n.y + 38}
                    fill="#10243A"
                    fontSize="16"
                    fontWeight="700"
                  >
                    <tspan x={n.x + 20} dy="0">
                      {n.t.split("\n")[0]}
                    </tspan>
                    <tspan x={n.x + 20} dy="20">
                      {n.t.split("\n")[1]}
                    </tspan>
                  </text>
                </g>
              );
            })}

            {/* Arrows */}
            <g stroke="url(#teal)" strokeWidth="3" fill="none" opacity="0.95">
              <path d="M330 120 C 270 120, 240 120, 230 120" />
              <path d="M350 140 C 430 140, 470 140, 520 140" />
              <path d="M620 160 C 580 180, 520 205, 470 220" />
              <path d="M230 260 C 260 240, 310 230, 350 220" />
              <path d="M570 300 C 540 310, 520 300, 490 280" />
              <path d="M590 170 C 680 180, 720 210, 740 260" />
            </g>

            {/* Arrowheads */}
            <g fill="#0E7C7B" opacity="0.95">
              <polygon points="320,120 330,114 330,126" />
              <polygon points="520,140 510,134 510,146" />
              <polygon points="470,220 480,214 480,226" />
              <polygon points="350,220 340,214 340,226" />
              <polygon points="490,280 480,274 480,286" />
              <polygon points="740,260 730,254 730,266" />
            </g>
          </svg>
        </div>

        <div className="mt-4 text-sm text-[#64748B]">
          Diagram explains relationships between approaches; it does not imply a
          fixed workflow for all research projects.
        </div>
      </div>
    </section>
  );
}
