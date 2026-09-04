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
import {
  JobDetailContent,
  JobCompanySidebar,
  JobMatchPanel,
  RelatedJobs,
  JobApplyActions,
  JobPostingJsonLd,
} from "@/components/marketplace";
import { JobTrustSection } from "@/components/trust/JobTrustSection";
import {
  getJobBySlugAsync,
  getJobsByCompanyIdAsync,
  getRelatedJobsAsync,
} from "@/lib/mock/services/jobs";
import { getCompanyById } from "@/lib/mock/fixtures/companies";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJobBySlugAsync(slug);
  if (!job) return { title: "Job Not Found" };

  const company = getCompanyById(job.companyId);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gojobs.bd";

  return {
    title: `${job.title} at ${company?.name ?? "Company"} | GoJobs`,
    description: job.description,
    openGraph: {
      title: job.title,
      description: job.description,
      type: "website",
      url: `${baseUrl}/${locale}/jobs/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/jobs/${slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("jobs");

  const job = await getJobBySlugAsync(slug);
  if (!job || job.status !== "published") notFound();

  const company = getCompanyById(job.companyId);
  if (!company) notFound();

  const [openJobs, relatedJobs] = await Promise.all([
    getJobsByCompanyIdAsync(job.companyId),
    getRelatedJobsAsync(job.id),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gojobs.bd";
  const shareUrl = `${baseUrl}/${locale}/jobs/${slug}`;

  return (
    <>
      <JobPostingJsonLd job={job} company={company} locale={locale} />

      <div className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>{t("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/jobs" />}>{t("title")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{job.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <JobApplyActions
            jobSlug={slug}
            jobTitle={job.title}
            shareUrl={shareUrl}
            applyGuestLabel={t("applyGuest")}
            applyPassportLabel={t("applyPassport")}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <JobDetailContent
              job={job}
              companyName={company.name}
              locale={locale}
            />
            <RelatedJobs jobs={relatedJobs} locale={locale} />
          </div>

          <aside className="space-y-6">
            <JobCompanySidebar
              company={company}
              openJobsCount={openJobs.length}
              locale={locale}
            />
            <JobTrustSection job={job} company={company} />
            <JobMatchPanel jobId={job.id} />
          </aside>
        </div>
      </div>
    </>
  );
}
