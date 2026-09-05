import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HeroSearch,
  JobCard,
  BrowseSections,
  HowGoJobsWorks,
  FeaturedEmployers,
} from "@/components/marketplace";
import { getFeaturedJobsAsync } from "@/lib/mock/services/jobs";
import { getMarketplaceStats } from "@/lib/mock/services/marketplace-stats";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [featuredJobs, stats] = await Promise.all([
    getFeaturedJobsAsync(),
    Promise.resolve(getMarketplaceStats()),
  ]);

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            {t("home.proofLine", {
              jobs: stats.openRoles,
              cities: stats.cities,
              employers: stats.verifiedEmployers,
            })}
          </p>
          <HeroSearch />
        </div>
      </section>

      <HowGoJobsWorks />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("home.featuredJobs")}</h2>
          <Link href="/jobs">
            <Button variant="ghost">{t("common.viewAll")}</Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} locale={locale} />
          ))}
        </div>
      </section>

      <FeaturedEmployers companies={stats.featuredEmployers} />

      <BrowseSections />

      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("home.candidateCta")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("home.candidateCtaBenefit")}</p>
              <Link href="/candidate/onboarding">
                <Button>{t("home.candidateCtaAction")}</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("home.employerCta")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("home.employerCtaBenefit")}</p>
              <Link href="/employer/onboarding">
                <Button variant="outline">{t("home.employerCtaAction")}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
