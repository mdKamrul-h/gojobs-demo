import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ApplySuccessView } from "@/components/marketplace";
import { getJobBySlugAsync } from "@/lib/mock/services/jobs";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ApplySuccessPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const job = await getJobBySlugAsync(slug);
  if (!job) notFound();

  const ref = typeof sp.ref === "string" ? sp.ref : `APP-${Date.now()}`;

  return (
    <ApplySuccessView
      referenceId={ref}
      jobTitle={job.title}
      jobSlug={slug}
    />
  );
}
