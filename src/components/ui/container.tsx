import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  background?: "default" | "secondary";
}

export function Container({
  children,
  className,
  noPadding = false,
  background = "default",
}: ContainerProps) {
  return (
    <div
      className={cn(
        "layout-standard",
        !noPadding && "section-padding-standard",
        background === "secondary" && "bg-secondary-background",
        className,
      )}
    >
      {children}
    </div>
  );
}
