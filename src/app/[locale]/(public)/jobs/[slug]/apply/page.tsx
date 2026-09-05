import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ApplyPathChoice, GuestApplyForm } from "@/components/marketplace";
import { getJobBySlugAsync } from "@/lib/mock/services/jobs";
import { getCompanyById } from "@/lib/mock/fixtures/companies";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function GuestApplyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const job = await getJobBySlugAsync(slug);
  if (!job || job.status !== "published") notFound();

  const company = getCompanyById(job.companyId);

  return (
    <div className="container mx-auto px-4 py-8">
      {company && (
        <p className="mb-4 text-sm text-muted-foreground">{company.name}</p>
      )}
      <ApplyPathChoice />
      <GuestApplyForm job={job} jobSlug={slug} />
    </div>
  );
}
