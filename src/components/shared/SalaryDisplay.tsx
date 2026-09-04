import type { SalaryRange } from "@/lib/types";
import { formatSalaryRange, formatSalaryRangeBn } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface SalaryDisplayProps {
  salary: SalaryRange;
  locale?: string;
  className?: string;
}

export function SalaryDisplay({ salary, locale = "en", className }: SalaryDisplayProps) {
  const formatted =
    locale === "bn" ? formatSalaryRangeBn(salary) : formatSalaryRange(salary);

  return (
    <span className={cn("font-medium text-foreground tabular-nums", className)}>
      {formatted}
    </span>
  );
}
