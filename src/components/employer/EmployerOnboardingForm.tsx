"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/shared/LocationPicker";
import { TrustIndicator } from "@/components/shared/TrustIndicator";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  approveEmployerTrust,
  getEmployerOnboarding,
  saveEmployerOnboarding,
  type EmployerOnboardingData,
} from "@/lib/mock/services/employer";
import type { CompanySize, Industry, Location } from "@/lib/types";

const industries: Industry[] = [
  "banking",
  "rmg",
  "ngo",
  "technology",
  "manufacturing",
  "retail",
  "healthcare",
  "education",
];

const sizes: CompanySize[] = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export function EmployerOnboardingForm() {
  const t = useTranslations("employer.onboarding");
  const tc = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [onboarding, setOnboarding] = useState<EmployerOnboardingData | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<Industry>("technology");
  const [size, setSize] = useState<CompanySize>("51-200");
  const [location, setLocation] = useState<Partial<Location>>({ divisionId: "dhaka" });
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getEmployerOnboarding().then((data) => {
      if (data) {
        setOnboarding(data);
        setCompanyName(data.companyName);
        setIndustry(data.industry);
        setSize(data.size);
        setLocation(data.location);
        setWebsite(data.website ?? "");
        setDescription(data.description);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.divisionId || !location.districtId) {
      toast.error(t("locationRequired"));
      return;
    }
    setSaving(true);
    try {
      const saved = await saveEmployerOnboarding({
        companyName,
        industry,
        size,
        location: location as Location,
        website: website || undefined,
        description,
      });
      setOnboarding(saved);
      toast.success(t("submitted"));
    } finally {
      setSaving(false);
    }
  };

  const handleSimulateApproval = async () => {
    setSaving(true);
    try {
      const approved = await approveEmployerTrust();
      if (approved) {
        setOnboarding(approved);
        toast.success(t("approved"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {onboarding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("trustStatus")}</CardTitle>
            <CardDescription>{t("trustDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <TrustIndicator status={onboarding.trustStatus} />
            {onboarding.trustStatus === "pending" && (
              <Button variant="outline" size="sm" onClick={handleSimulateApproval} disabled={saving}>
                {t("simulateApproval")}
              </Button>
            )}
            {onboarding.trustStatus === "approved" && (
              <Button size="sm" onClick={() => router.push("/employer")}>
                {t("goToDashboard")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("companyInfo")}</CardTitle>
          <CardDescription>{t("companyInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("companyName")}</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("industry")}</Label>
                <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {t(`industries.${ind}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("size")}</Label>
                <Select value={size} onValueChange={(v) => setSize(v as CompanySize)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("location")}</Label>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t("website")}</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {onboarding ? tc("save") : t("submit")}
              </Button>
              {onboarding?.trustStatus === "approved" && (
                <Button type="button" variant="outline" onClick={() => router.push("/employer")}>
                  {t("goToDashboard")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
