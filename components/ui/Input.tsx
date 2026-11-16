import type { InputHTMLAttributes } from "react";

export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
  inputMode,
  name,
  ariaLabel,
  }: {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  name?: string;
  ariaLabel: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-label={ariaLabel}
      className="w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-base text-[#1E293B] placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C6D8] focus-visible:ring-offset-2"
    />
  );
}
