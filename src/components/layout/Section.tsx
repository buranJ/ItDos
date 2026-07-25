import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article";
  spacing?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
};

const spacingClasses = {
  none: "",
  sm: "py-16 md:py-20",
  md: "py-24 md:py-28",
  lg: "py-28 md:py-36 lg:py-40",
};

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  spacing = "md",
  style,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(spacingClasses[spacing], className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
