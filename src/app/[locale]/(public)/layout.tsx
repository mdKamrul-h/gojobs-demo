import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Locale } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  return <MainLayout locale={locale as Locale}>{children}</MainLayout>;
}
