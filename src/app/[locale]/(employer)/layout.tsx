import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmployerGuard } from "@/components/employer/EmployerGuard";
import type { Locale } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function EmployerLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <MainLayout locale={locale as Locale}>
      <EmployerGuard locale={locale}>{children}</EmployerGuard>
    </MainLayout>
  );
}
