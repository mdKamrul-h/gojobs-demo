import { setRequestLocale } from "next-intl/server";
import { PricingPageContent } from "@/components/admin/PricingPageContent";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingPageContent locale={locale as Locale} />;
}
