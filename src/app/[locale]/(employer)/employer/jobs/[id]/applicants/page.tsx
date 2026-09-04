import { setRequestLocale } from "next-intl/server";
import { AtsBoard } from "@/components/ats/AtsBoard";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EmployerApplicantsPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <AtsBoard jobId={id} locale={locale} />;
}
