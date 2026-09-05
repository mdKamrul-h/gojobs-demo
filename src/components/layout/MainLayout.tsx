import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Locale } from "@/i18n/routing";

interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
}

export async function MainLayout({ children, locale }: MainLayoutProps) {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
      >
        {t("skipToContent")}
      </a>
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1} className="w-full flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
