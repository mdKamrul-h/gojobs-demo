import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HeroSearch,
  JobCard,
  BrowseSections,
} from "@/components/marketplace";
import { getFeaturedJobsAsync } from "@/lib/mock/services/jobs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const featuredJobs = await getFeaturedJobsAsync();

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
          <HeroSearch />
        </div>
      </section>

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

      <BrowseSections />

      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("home.candidateCta")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/candidate/onboarding">
                <Button>{t("common.learnMore")}</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("home.employerCta")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/employer/onboarding">
                <Button variant="outline">{t("common.learnMore")}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
