import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "good" | "warn";
}

export function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/90 p-5 shadow-sm">
      <p className="text-sm font-medium text-paragraph">{label}</p>
      <p className="mt-3 text-2xl font-bold text-heading md:text-3xl">{value}</p>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            tone === "good" && "text-emerald-700",
            tone === "warn" && "text-amber-700",
            tone === "neutral" && "text-paragraph",
          )}
        >
          {hint}
        </p>
      ) : null}
    </Card>
  );
}
