import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  action,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-heading md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-paragraph md:text-base">{description}</p>
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}
