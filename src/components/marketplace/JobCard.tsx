import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SalaryDisplay, TrustIndicator } from "@/components/shared";
import { SaveJobButton } from "./SaveJobButton";
import { getCompanyById } from "@/lib/mock/fixtures/companies";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import { companyInitials, formatPostedAgo } from "@/lib/utils/format";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  locale: string;
}

export async function JobCard({ job, locale }: JobCardProps) {
  const t = await getTranslations("jobs");
  const company = getCompanyById(job.companyId);
  const location = getLocationDisplay(job.location, locale);
  const postedAgo = formatPostedAgo(job.postedAt, locale);

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="mt-0.5 rounded-lg">
            <AvatarFallback className="rounded-lg">
              {companyInitials(company?.name ?? job.title)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base leading-snug">
                <Link href={`/jobs/${job.slug}`} className="hover:underline">
                  {job.title}
                </Link>
              </CardTitle>
              {company && <TrustIndicator status={company.trustStatus} />}
            </div>
            {company ? (
              <Link
                href={`/companies/${company.slug}`}
                className="text-sm text-muted-foreground hover:underline"
              >
                {company.name}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
          <SaveJobButton jobId={job.id} />
        </div>
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
  );
}
