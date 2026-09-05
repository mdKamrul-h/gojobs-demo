import { formatDistanceToNow } from "date-fns";
import { bn, enUS } from "date-fns/locale";
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

export function formatPostedAgo(date: Date | string, locale?: string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locale === "bn" ? bn : enUS,
  });
}

export function companyInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
