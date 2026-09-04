import type { SalaryRange } from "@/lib/types";

export function formatBDT(amount: number, locale = "en-BD"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrency(amount: number, currency: string, locale = "en"): string {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatSalaryRange(salary: SalaryRange, locale = "en-BD"): string {
  const formatter = (amount: number) =>
    salary.currency === "BDT"
      ? formatBDT(amount, locale)
      : formatCurrency(amount, salary.currency, locale.includes("bn") ? "bn" : "en");

  const min = formatter(salary.min);
  const max = formatter(salary.max);
  const period = salary.period === "monthly" ? "/mo" : "/yr";
  return `${min} – ${max}${period}`;
}

export function formatSalaryRangeBn(salary: SalaryRange): string {
  const formatNum = (n: number) =>
    new Intl.NumberFormat("bn-BD").format(n);
  return `৳${formatNum(salary.min)} – ৳${formatNum(salary.max)}${salary.period === "monthly" ? "/মাস" : "/বছর"}`;
}

export function isGeneralAssessmentEligible(matchScore: number): boolean {
  return matchScore >= 50;
}
