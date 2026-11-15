import type { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
