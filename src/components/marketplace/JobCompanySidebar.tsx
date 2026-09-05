import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Building2, Globe, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustIndicator } from "@/components/shared";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import type { Company } from "@/lib/types";

interface JobCompanySidebarProps {
  company: Company;
  openJobsCount: number;
  locale: string;
}

export async function JobCompanySidebar({
  company,
  openJobsCount,
  locale,
}: JobCompanySidebarProps) {
  const t = await getTranslations("jobs");
  const tc = await getTranslations("companies");
  const location = getLocationDisplay(company.location, locale);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{company.name}</CardTitle>
          <TrustIndicator status={company.trustStatus} />
        </div>
        <Badge variant="secondary">{tc(`industry.${company.industry}`)}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {company.description}
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{location.full}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <span>{tc("size", { size: company.size })}</span>
          </div>
          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>{tc("openJobs", { count: openJobsCount })}</span>
          </div>
        </div>
        <Link href={`/companies/${company.slug}`}>
          <Button variant="outline" className="w-full">
            {t("viewCompany")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
