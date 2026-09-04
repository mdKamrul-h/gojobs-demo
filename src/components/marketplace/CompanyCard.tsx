import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Building2, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustIndicator } from "@/components/shared";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import type { Company } from "@/lib/types";

interface CompanyCardProps {
  company: Company;
  openJobsCount: number;
}

export async function CompanyCard({ company, openJobsCount }: CompanyCardProps) {
  const t = await getTranslations("companies");
  const location = getLocationDisplay(company.location);

  return (
    <Link href={`/companies/${company.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{company.name}</CardTitle>
            <TrustIndicator status={company.trustStatus} />
          </div>
          <Badge variant="secondary">{t(`industry.${company.industry}`)}</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {company.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {location.full}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {t("size", { size: company.size })}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {t("openJobs", { count: openJobsCount })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
