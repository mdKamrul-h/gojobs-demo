import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { AtsBoard } from "@/components/ats/AtsBoard";
import { LoadingState } from "@/components/shared/LoadingState";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function EmployerApplicantsPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<LoadingState />}>
      <AtsBoard jobId={id} locale={locale} />
    </Suspense>
  );
}
