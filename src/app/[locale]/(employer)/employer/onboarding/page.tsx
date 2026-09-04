import { setRequestLocale } from "next-intl/server";
import { EmployerOnboardingForm } from "@/components/employer/EmployerOnboardingForm";

type Props = { params: Promise<{ locale: string }> };

export default async function EmployerOnboardingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EmployerOnboardingForm />;
}
