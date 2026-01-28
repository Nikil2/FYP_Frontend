import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "tertiary";
}

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    tertiary: "bg-tertiary text-tertiary-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
