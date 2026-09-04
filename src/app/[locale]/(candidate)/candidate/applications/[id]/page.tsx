import { setRequestLocale } from "next-intl/server";
import { ApplicationDetail } from "@/components/candidate/applications/ApplicationDetail";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ApplicationDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ApplicationDetail applicationId={id} />;
}
