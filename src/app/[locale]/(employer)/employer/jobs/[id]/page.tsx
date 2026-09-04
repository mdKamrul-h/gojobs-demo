import { setRequestLocale } from "next-intl/server";
import { JobDetailView } from "@/components/employer/JobDetailView";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EmployerJobDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <JobDetailView jobId={id} locale={locale} />;
}
