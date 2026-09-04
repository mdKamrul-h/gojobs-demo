import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryDisplay, TrustIndicator } from "@/components/shared";
import { getCompanyById } from "@/lib/mock/fixtures/companies";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import type { Job } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  locale: string;
}

export async function JobCard({ job, locale }: JobCardProps) {
  const t = await getTranslations("jobs");
  const company = getCompanyById(job.companyId);
  const location = getLocationDisplay(job.location);
  const postedAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

  return (
    <Link href={`/jobs/${job.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
            {company && <TrustIndicator status={company.trustStatus} />}
          </div>
          <p className="text-sm text-muted-foreground">{company?.name}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{location.full}</p>
          <SalaryDisplay salary={job.salary} locale={locale} />
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">{t(`workMode.${job.workMode}`)}</Badge>
            <Badge variant="outline">{t(`occupation.${job.occupation}`)}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("posted")} {postedAgo}
            {job.applicantCount != null && (
              <span> · {t("applicants", { count: job.applicantCount })}</span>
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
