import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, style }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-6 shadow-sm",
        hover && "animation-standard hover:shadow-lg hover:-translate-y-1",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
