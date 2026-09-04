import { setRequestLocale } from "next-intl/server";
import { SavedJobsList } from "@/components/candidate/saved/SavedJobsList";

type Props = { params: Promise<{ locale: string }> };

export default async function SavedJobsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SavedJobsList />;
}
