"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { divisions } from "@/lib/mock/fixtures/locations";

const CHIPS = [
  { href: "/jobs?division=dhaka", kind: "division" as const, id: "dhaka" },
  { href: "/jobs?division=chittagong", kind: "division" as const, id: "chittagong" },
  {
    href: "/jobs?division=dhaka&district=gazipur",
    kind: "district" as const,
    divisionId: "dhaka",
    districtId: "gazipur",
  },
  { href: "/jobs?occupation=accountant", kind: "chip" as const, key: "chipAccountant" },
  {
    href: "/jobs?occupation=software_engineer",
    kind: "chip" as const,
    key: "chipSoftware",
  },
  { href: "/jobs?occupation=sales_executive", kind: "occupation" as const, id: "sales_executive" },
];

export function HeroSearch() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const tJobs = useTranslations("jobs");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("all");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (division !== "all") params.set("division", division);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="hero-role">{t("searchRoleLabel")}</Label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="hero-role"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchRolePlaceholder")}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-left">
            <Label htmlFor="hero-location">{t("searchLocationLabel")}</Label>
            <Select value={division} onValueChange={(v) => setDivision(v ?? "all")}>
              <SelectTrigger id="hero-location" aria-label={t("searchLocationLabel")}>
                <SelectValue placeholder={t("searchLocationPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allLocations")}</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {locale === "bn" ? d.nameBn : d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="sm:mb-px">
            {tCommon("search")}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-left">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("popularSearches")}
        </p>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            let label = "";
            if (chip.kind === "division") {
              const d = divisions.find((item) => item.id === chip.id);
              label = locale === "bn" ? (d?.nameBn ?? chip.id) : (d?.name ?? chip.id);
            } else if (chip.kind === "district") {
              const d = divisions
                .find((item) => item.id === chip.divisionId)
                ?.districts.find((item) => item.id === chip.districtId);
              label = locale === "bn" ? (d?.nameBn ?? chip.districtId) : (d?.name ?? chip.districtId);
            } else if (chip.kind === "occupation") {
              label = tJobs(`occupation.${chip.id}`);
            } else {
              label = t(chip.key);
            }
            return (
              <Link key={chip.href} href={chip.href}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer px-3 py-1 text-sm hover:bg-secondary/80"
                >
                  {label}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
