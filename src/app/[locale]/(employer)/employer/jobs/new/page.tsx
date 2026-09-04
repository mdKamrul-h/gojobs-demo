import { setRequestLocale } from "next-intl/server";
import { JobCreationForm } from "@/components/employer/JobCreationForm";

type Props = { params: Promise<{ locale: string }> };

export default async function NewJobPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JobCreationForm locale={locale} />;
}
