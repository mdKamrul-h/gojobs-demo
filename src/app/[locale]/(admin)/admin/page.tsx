import { setRequestLocale } from "next-intl/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getFlaggedJobs,
  getPlatformStats,
  getTrustReviewQueue,
} from "@/components/admin/admin-data";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = getPlatformStats();
  const flaggedJobs = getFlaggedJobs();
  const trustQueue = getTrustReviewQueue();

  return (
    <AdminDashboard
      stats={stats}
      flaggedJobs={flaggedJobs}
      trustQueue={trustQueue}
      locale={locale as Locale}
    />
  );
}
