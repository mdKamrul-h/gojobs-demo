import { setRequestLocale } from "next-intl/server";
import { EmployerDashboard } from "@/components/employer/EmployerDashboard";

type Props = { params: Promise<{ locale: string }> };

export default async function EmployerDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EmployerDashboard locale={locale} />;
}
