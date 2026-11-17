export default function HeroMolecularVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0B192C] p-6 text-slate-200 shadow-2xl">
      {/* Background Grid & Potential Energy Contours */}
      <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      {/* Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3 font-mono text-xs text-[#06B6D4]">
        <span>SYS.ALG.BIO // LALS-DHAKA</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
          ACTIVE KERNEL
        </span>
      </div>

      {/* SVG Canvas Centerpiece */}
      <div className="relative my-6 flex aspect-[4/3] items-center justify-center">
        <svg
          viewBox="0 0 400 300"
          className="h-full w-full max-w-md overflow-visible"
          aria-hidden="true"
        >
          {/* Layer 1: Potential Energy Contour Rings */}
          <g
            className="motion-safe:animate-[spin_45s_linear_infinite]"
            style={{ transformOrigin: "200px 150px" }}
          >
            <ellipse
              cx="200"
              cy="150"
              rx="140"
              ry="90"
              fill="none"
              stroke="#0D9488"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <ellipse
              cx="200"
              cy="150"
              rx="100"
              ry="60"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="1"
              opacity="0.25"
            />
            <ellipse
              cx="200"
              cy="150"
              rx="60"
              ry="35"
              fill="none"
              stroke="#0D9488"
              strokeWidth="1.5"
              opacity="0.4"
            />
          </g>

          {/* Layer 2: Molecular Graph & Binding Topology */}
          <g>
            <line
              x1="120"
              y1="100"
              x2="200"
              y2="150"
              stroke="#06B6D4"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <line
              x1="280"
              y1="100"
              x2="200"
              y2="150"
              stroke="#06B6D4"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <line
              x1="200"
              y1="220"
              x2="200"
              y2="150"
              stroke="#0D9488"
              strokeWidth="2"
              opacity="0.8"
            />
            <line
              x1="120"
              y1="200"
              x2="200"
              y2="150"
              stroke="#0D9488"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="280"
              y1="200"
              x2="200"
              y2="150"
              stroke="#0D9488"
              strokeWidth="1.5"
              opacity="0.5"
            />

            <line x1="120" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="1" />
            <line x1="120" y1="100" x2="120" y2="200" stroke="#334155" strokeWidth="1" />
            <line x1="280" y1="100" x2="280" y2="200" stroke="#334155" strokeWidth="1" />
            <line x1="120" y1="200" x2="280" y2="200" stroke="#334155" strokeWidth="1" />

            <circle cx="120" cy="100" r="4" fill="#06B6D4" className="motion-safe:animate-pulse" />
            <circle cx="280" cy="100" r="4" fill="#06B6D4" className="motion-safe:animate-pulse" />
            <circle cx="120" cy="200" r="4" fill="#0D9488" />
            <circle cx="280" cy="200" r="4" fill="#0D9488" />

            <circle
              cx="200"
              cy="150"
              r="7"
              fill="#ffffff"
              stroke="#06B6D4"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* Layer 3: Glassmorphic Method Telemetry Badges */}
      <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 font-mono text-[11px] text-slate-400">
        <div className="rounded bg-slate-900/60 p-2 backdrop-blur border border-slate-800">
          <span className="block text-[10px] text-slate-500">SURFACE</span>
          <span className="text-[#06B6D4]">DFT Electron Density</span>
        </div>
        <div className="rounded bg-slate-900/60 p-2 backdrop-blur border border-slate-800">
          <span className="block text-[10px] text-slate-500">BINDING</span>
          <span className="text-[#06B6D4]">ΔG Trajectory</span>
        </div>
        <div className="rounded bg-slate-900/60 p-2 backdrop-blur border border-slate-800">
          <span className="block text-[10px] text-slate-500">ENSEMBLE</span>
          <span className="text-[#06B6D4]">MD Conformations</span>
        </div>
      </div>
    </div>
  );
}
