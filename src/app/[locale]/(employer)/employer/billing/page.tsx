import { setRequestLocale } from "next-intl/server";
import { BillingDashboard } from "@/components/admin/BillingDashboard";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function EmployerBillingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BillingDashboard locale={locale as Locale} />;
}
