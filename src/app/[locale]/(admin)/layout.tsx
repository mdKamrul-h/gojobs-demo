import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import type { Locale } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <MainLayout locale={locale as Locale}>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </MainLayout>
  );
}
