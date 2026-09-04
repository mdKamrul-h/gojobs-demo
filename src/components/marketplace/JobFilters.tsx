"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { divisions } from "@/lib/mock/fixtures/locations";
import type { Industry, Occupation, Seniority, WorkMode } from "@/lib/types";

const OCCUPATIONS: Occupation[] = [
  "accountant",
  "hr_manager",
  "sales_executive",
  "rmg_merchandiser",
  "software_engineer",
  "marketing_manager",
  "operations_manager",
  "customer_service",
];

const WORK_MODES: WorkMode[] = ["on_site", "hybrid", "remote"];

const INDUSTRIES: Industry[] = [
  "banking",
  "rmg",
  "ngo",
  "technology",
  "manufacturing",
  "retail",
  "healthcare",
  "education",
];

const SENIORITIES: Seniority[] = ["entry", "mid", "senior", "lead", "manager"];

const SALARY_RANGES = [
  { label: "Any", min: "", max: "" },
  { label: "৳30k – ৳50k", min: "30000", max: "50000" },
  { label: "৳50k – ৳80k", min: "50000", max: "80000" },
  { label: "৳80k – ৳1.2L", min: "80000", max: "120000" },
  { label: "৳1.2L+", min: "120000", max: "" },
];

export function JobFilters() {
  const t = useTranslations("jobs");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const q = searchParams.get("q");
    router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname);
  }

  const divisionId = searchParams.get("division") ?? "";
  const selectedDivision = divisions.find((d) => d.id === divisionId);
  const districts = selectedDivision?.districts ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("filters")}</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t("clearFilters")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("filterLocation")}</Label>
          <Select
            value={divisionId || "all"}
            onValueChange={(v) => {
              updateParam("division", v === "all" ? null : v);
              updateParam("district", null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterLocation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLocations")}</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {districts.length > 0 && (
            <Select
              value={searchParams.get("district") ?? "all"}
              onValueChange={(v) => updateParam("district", v === "all" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filterDistrict")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allDistricts")}</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t("filterSalary")}</Label>
          <Select
            value={
              searchParams.get("salaryMin") && searchParams.get("salaryMax")
                ? `${searchParams.get("salaryMin")}-${searchParams.get("salaryMax")}`
                : searchParams.get("salaryMin")
                  ? `${searchParams.get("salaryMin")}-`
                  : "all"
            }
            onValueChange={(v) => {
              if (!v || v === "all") {
                updateParam("salaryMin", null);
                updateParam("salaryMax", null);
              } else {
                const [min, max] = v.split("-");
                updateParam("salaryMin", min || null);
                updateParam("salaryMax", max || null);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterSalary")} />
            </SelectTrigger>
            <SelectContent>
              {SALARY_RANGES.map((r) => (
                <SelectItem
                  key={r.label}
                  value={r.min ? `${r.min}-${r.max}` : "all"}
                >
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filterWorkMode")}</Label>
          <Select
            value={searchParams.get("workMode") ?? "all"}
            onValueChange={(v) => updateParam("workMode", v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterWorkMode")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allWorkModes")}</SelectItem>
              {WORK_MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {t(`workMode.${m}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filterIndustry")}</Label>
          <Select
            value={searchParams.get("industry") ?? "all"}
            onValueChange={(v) => updateParam("industry", v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterIndustry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allIndustries")}</SelectItem>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>
                  {t(`industry.${i}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filterExperience")}</Label>
          <Select
            value={searchParams.get("seniority") ?? "all"}
            onValueChange={(v) => updateParam("seniority", v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterExperience")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allExperience")}</SelectItem>
              {SENIORITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`seniority.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filterOccupation")}</Label>
          <Select
            value={searchParams.get("occupation") ?? "all"}
            onValueChange={(v) => updateParam("occupation", v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterOccupation")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allOccupations")}</SelectItem>
              {OCCUPATIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {t(`occupation.${o}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("filterGlobal")}</Label>
          <Select
            value={searchParams.get("global") ?? "all"}
            onValueChange={(v) => updateParam("global", v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterGlobal")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allRegions")}</SelectItem>
              <SelectItem value="bd">{t("regionBd")}</SelectItem>
              <SelectItem value="remote_global">{t("regionRemoteGlobal")}</SelectItem>
              <SelectItem value="international">{t("regionInternational")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
