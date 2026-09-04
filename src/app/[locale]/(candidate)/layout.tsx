import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CandidateGuard } from "@/components/candidate/CandidateGuard";
import type { Locale } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function CandidateLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <MainLayout locale={locale as Locale}>
      <CandidateGuard>{children}</CandidateGuard>
    </MainLayout>
  );
}
