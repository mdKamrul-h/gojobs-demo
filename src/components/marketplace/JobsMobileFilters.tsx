"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JobFilters } from "./JobFilters";

const FILTER_KEYS = [
  "division",
  "district",
  "workMode",
  "occupation",
  "industry",
  "seniority",
  "salaryMin",
  "salaryMax",
  "global",
];

export function JobsMobileFilters() {
  const t = useTranslations("jobs");
  const searchParams = useSearchParams();
  const activeCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length;

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" className="w-full gap-2 sm:w-auto" />
          }
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("showFilters")}
          {activeCount > 0 ? ` (${activeCount})` : ""}
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto lg:hidden">
          <SheetHeader>
            <SheetTitle>{t("filters")}</SheetTitle>
          </SheetHeader>
          <div className="px-2 pb-6">
            <JobFilters />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
