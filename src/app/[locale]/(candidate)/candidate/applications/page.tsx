import { setRequestLocale } from "next-intl/server";
import { ApplicationsList } from "@/components/candidate/applications/ApplicationsList";

type Props = { params: Promise<{ locale: string }> };

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ApplicationsList />;
}
