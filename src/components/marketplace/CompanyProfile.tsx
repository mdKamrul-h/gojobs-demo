import { getTranslations } from "next-intl/server";
import { Globe, MapPin, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrustIndicator } from "@/components/shared";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import type { Company } from "@/lib/types";

interface CompanyProfileProps {
  company: Company;
  openJobsCount: number;
}

export async function CompanyProfile({ company, openJobsCount }: CompanyProfileProps) {
  const t = await getTranslations("companies");
  const location = getLocationDisplay(company.location);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">{company.name}</h1>
          <TrustIndicator status={company.trustStatus} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{t(`industry.${company.industry}`)}</Badge>
          <Badge variant="outline">{t("size", { size: company.size })}</Badge>
          <Badge variant="outline">{t("openJobs", { count: openJobsCount })}</Badge>
        </div>
      </div>

      <p className="text-muted-foreground">{company.description}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{location.full}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 shrink-0" />
          <span>
            {company.employeeCount
              ? t("employees", { count: company.employeeCount })
              : t("size", { size: company.size })}
          </span>
        </div>
        {company.foundedYear && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{t("founded", { year: company.foundedYear })}</span>
          </div>
        )}
        {company.website && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
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
      </div>
    </div>
  );
}
