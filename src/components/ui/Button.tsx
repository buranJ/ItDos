import { cn } from "@/lib/utils";

/**
 * One pill, four skins. Before this existed the same conceptual button was
 * hand-rolled per section and drifted into four different paddings
 * (px-6/px-7/px-8, py-3.5/py-4), so nothing lined up between sections.
 */
export type ButtonVariant = "accent" | "dark" | "outline" | "outlineLight";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-sm",
};

const variants: Record<ButtonVariant, string> = {
  accent:
    "bg-accent text-accent-ink shadow-[0_4px_20px_rgba(110,86,255,0.28)] hover:bg-accent-bright hover:shadow-[0_6px_32px_rgba(110,86,255,0.48)]",
  dark:
    "bg-[#0a0a0a] text-white shadow-[0_4px_20px_rgba(0,0,0,0.16)] hover:bg-[#1a1a1a] hover:shadow-[0_6px_28px_rgba(0,0,0,0.22)]",
  outline: "border border-line text-fg hover:border-fg/50",
  outlineLight:
    "border border-[#e5e5e5] bg-white text-[#0a0a0a] shadow-sm hover:border-[#0a0a0a]",
};

/** Class string for anchors and `next/link`, which can't be a <button>. */
export function buttonClass(
  variant: ButtonVariant = "accent",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, sizes[size], variants[variant], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "accent",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
