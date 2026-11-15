import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "outline";

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2",
    variant === "primary" &&
      "bg-[#10243A] text-white hover:bg-[#0F2A43]",
    variant === "secondary" &&
      "border border-[#0F2A43] bg-transparent text-[#10243A] hover:bg-[#F1F5F9]",
    variant === "outline" &&
      "border border-[#0F2A43] bg-transparent text-[#0F2A43] hover:bg-[#F1F5F9]",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
}
