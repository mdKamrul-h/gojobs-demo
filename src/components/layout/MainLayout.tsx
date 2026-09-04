import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Locale } from "@/i18n/routing";

interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header locale={locale} />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
