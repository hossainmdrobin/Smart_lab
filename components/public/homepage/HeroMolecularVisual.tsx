"use client";

import { useState } from "react";

export default function HeroMolecularVisual() {
  const [tab, setTab] = useState<"docking" | "dft" | "md">("docking");
  const [energy, setEnergy] = useState(-9.8);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#0B192C] p-6 text-slate-200 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
        <div>
          <span className="font-mono text-xs text-[#06B6D4]">LALS.COMP // WORKSTATION</span>
          <h3 className="text-sm font-semibold text-white">In Silico Analysis Engine</h3>
        </div>
        <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-700">
          {(["docking", "dft", "md"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setEnergy(t === "dft" ? -14.2 : t === "md" ? -11.5 : -9.8);
              }}
              className={`rounded px-2.5 py-1 text-xs font-medium uppercase transition-colors ${
                tab === t ? "bg-[#0D9488] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative my-5 aspect-[16/10] rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {tab === "docking" && "Protein-Ligand Complex"}
              {tab === "dft" && "DFT Electron Density"}
              {tab === "md" && "100ns MD Trajectory"}
            </span>
            <div className="mt-1 font-mono text-lg font-bold text-[#06B6D4]">
              ΔG = {energy} kcal/mol
            </div>
          </div>
          <span className="font-mono text-xs text-emerald-400">Validated</span>
        </div>

        <div className="relative z-10 my-auto flex items-center justify-center">
          <svg viewBox="0 0 320 140" className="h-28 w-full" aria-hidden="true">
            <path
              d="M 20 110 Q 80 20 160 70 T 300 40"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <circle cx="160" cy="70" r="5" fill="#ffffff" stroke="#06B6D4" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative z-10 border-t border-slate-800/80 pt-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Affinity Threshold</span>
            <span>{Math.abs(energy)} kcal/mol</span>
          </div>
          <input
            type="range"
            min="-18"
            max="-6"
            step="0.1"
            value={Math.abs(energy)}
            onChange={(e) => setEnergy(-parseFloat(e.target.value))}
            aria-label="Affinity Threshold"
            className="mt-1.5 w-full accent-[#0D9488] cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-700/80 pt-3 font-mono text-[11px] text-slate-400">
        <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
          <span className="block text-[10px] text-slate-500">ENGINE</span>
          <span className="text-white">{tab === "docking" ? "Vina" : tab === "dft" ? "B3LYP" : "GROMACS"}</span>
        </div>
        <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
          <span className="block text-[10px] text-slate-500">FIELD</span>
          <span className="text-white">Charmm36m</span>
        </div>
        <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
          <span className="block text-[10px] text-slate-500">STATUS</span>
          <span className="text-[#06B6D4]">Converged</span>
        </div>
      </div>
    </div>
  );
}
