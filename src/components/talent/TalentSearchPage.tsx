"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Sparkles } from "lucide-react";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { TalentSearchResult } from "./TalentSearchResult";
import { SalaryIntelligenceWidget } from "./SalaryIntelligenceWidget";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { searchTalent, getSalaryBenchmark } from "@/lib/mock/fixtures/talent";
import type { Occupation } from "@/lib/types";

const OCCUPATIONS: Occupation[] = [
  "accountant",
  "hr_manager",
  "software_engineer",
  "sales_executive",
];

export function TalentSearchPage() {
  const t = useTranslations("talent");
  const tJobs = useTranslations("jobs");
  const [query, setQuery] = useState("");
  const [nlQuery, setNlQuery] = useState("");
  const [occupation, setOccupation] = useState<string>("all");
  const [results, setResults] = useState(() => searchTalent("", undefined));

  function handleSearch() {
    const searchQ = nlQuery || query;
    setResults(searchTalent(searchQ, occupation === "all" ? undefined : occupation));
  }

  function handleNlSearch() {
    setQuery("");
    setResults(searchTalent(nlQuery, occupation === "all" ? undefined : occupation));
  }

  const benchmark = getSalaryBenchmark(occupation === "all" ? "accountant" : occupation);

  return (
    <PageContainer className="space-y-8">
      <EmployerNav />
      <div>
        <h1 className="text-2xl font-bold">{t("searchTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("searchSubtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("filters")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("keywordSearch")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{tJobs("filterOccupation")}</Label>
                <Select value={occupation} onValueChange={(v) => setOccupation(v ?? "all")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tJobs("allOccupations")}</SelectItem>
                    {OCCUPATIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {tJobs(`occupation.${o}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                {t("nlSearch")}
              </CardTitle>
              <CardDescription>{t("nlSearchDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder={t("nlPlaceholder")}
              />
              <Button variant="secondary" onClick={handleNlSearch}>
                {t("nlSearchButton")}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("resultsCount", { count: results.length })}</p>
            {results.map((profile) => (
              <TalentSearchResult key={profile.id} profile={profile} />
            ))}
          </div>
        </div>

        <aside>{benchmark && <SalaryIntelligenceWidget benchmark={benchmark} />}</aside>
      </div>
    </PageContainer>
  );
}
