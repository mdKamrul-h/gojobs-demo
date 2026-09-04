import { setRequestLocale } from "next-intl/server";
import { CandidateDashboard } from "@/components/candidate/dashboard/CandidateDashboard";

type Props = { params: Promise<{ locale: string }> };

export default async function CandidateDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CandidateDashboard />;
}
