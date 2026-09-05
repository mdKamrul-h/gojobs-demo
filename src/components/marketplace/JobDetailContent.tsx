import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SalaryDisplay } from "@/components/shared";
import { getLocationDisplay } from "@/lib/mock/fixtures/locations";
import { formatPostedAgo } from "@/lib/utils/format";
import type { Job } from "@/lib/types";

interface JobDetailContentProps {
  job: Job;
  companyName: string;
  locale: string;
}

export async function JobDetailContent({
  job,
  companyName,
  locale,
}: JobDetailContentProps) {
  const t = await getTranslations("jobs");
  const location = getLocationDisplay(job.location, locale);
  const postedAgo = formatPostedAgo(job.postedAt, locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{job.title}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{companyName}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SalaryDisplay salary={job.salary} locale={locale} className="text-lg" />
          <span className="text-sm text-muted-foreground">{location.full}</span>
          <span className="text-sm text-muted-foreground">
            {t("posted")} {postedAgo}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{t(`workMode.${job.workMode}`)}</Badge>
          <Badge variant="outline">{t(`occupation.${job.occupation}`)}</Badge>
          <Badge variant="outline">{t(`seniority.${job.seniority}`)}</Badge>
        </div>
      </div>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold">{t("description")}</h2>
        <p className="mt-2 text-muted-foreground">{job.description}</p>
      </section>

      {job.responsibilities.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">{t("responsibilities")}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
            {job.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {job.hardRequirements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">{t("hardRequirements")}</h2>
          <ul className="mt-2 space-y-2">
            {job.hardRequirements.map((req) => (
              <li key={req.id} className="flex items-start gap-2 text-sm">
                <Badge
                  variant="outline"
                  className="shrink-0 border-border bg-muted/50 text-xs font-medium text-muted-foreground"
                >
                  {t("mustHave")}
                </Badge>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.softRequirements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">{t("softRequirements")}</h2>
          <ul className="mt-2 space-y-2">
            {job.softRequirements.map((req) => (
              <li key={req.id} className="flex items-start gap-2 text-sm">
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {t("preferred")}
                </Badge>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
