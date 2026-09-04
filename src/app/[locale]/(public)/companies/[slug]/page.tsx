import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/routing";
import { CompanyProfile, JobCard } from "@/components/marketplace";
import { getCompanyBySlugAsync } from "@/lib/mock/services/companies";
import { getJobsByCompanyIdAsync } from "@/lib/mock/services/jobs";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const company = await getCompanyBySlugAsync(slug);
  if (!company) return { title: "Company Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gojobs.bd";

  return {
    title: `${company.name} | GoJobs`,
    description: company.description,
    openGraph: {
      title: company.name,
      description: company.description,
      type: "website",
      url: `${baseUrl}/${locale}/companies/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/companies/${slug}`,
    },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("companies");

  const company = await getCompanyBySlugAsync(slug);
  if (!company) notFound();

  const openJobs = await getJobsByCompanyIdAsync(company.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>{t("home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/companies" />}>{t("title")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CompanyProfile company={company} openJobsCount={openJobs.length} />

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">{t("openPositions")}</h2>
        {openJobs.length === 0 ? (
          <p className="text-muted-foreground">{t("noOpenJobs")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {openJobs.map((job) => (
              <JobCard key={job.id} job={job} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
