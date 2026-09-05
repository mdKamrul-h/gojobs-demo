"use client";

import { useTranslations } from "next-intl";
import { Briefcase, ChevronDown, LogOut } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";
import { MobileNav } from "./MobileNav";
import type { Locale } from "@/i18n/routing";

interface HeaderProps {
  locale: Locale;
}

function navClass(active: boolean) {
  return cn(
    "text-sm font-medium transition-colors hover:text-foreground",
    active ? "text-foreground" : "text-muted-foreground"
  );
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAuthenticated, logout } = useDemoAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const dashboardHref =
    role === "candidate"
      ? "/candidate"
      : role === "recruiter"
        ? "/employer"
        : role === "admin"
          ? "/admin"
          : "/";

  const jobsActive = pathname === "/jobs" || pathname.startsWith("/jobs/");
  const companiesActive =
    pathname === "/companies" || pathname.startsWith("/companies/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 w-full items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Briefcase className="h-6 w-6" />
            <span>{tCommon("appName")}</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/jobs"
              aria-current={jobsActive ? "page" : undefined}
              className={navClass(jobsActive)}
            >
              {t("jobs")}
            </Link>
            <Link
              href="/companies"
              aria-current={companiesActive ? "page" : undefined}
              className={navClass(companiesActive)}
            >
              {t("companies")}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("more")}
                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/campus" />}>
                    {t("campus")}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/frontline" />}>
                    {t("frontline")}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/pricing" />}>
                    {t("pricing")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <RoleSwitcher />
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  {t("dashboard")}
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("logout")}</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  {t("login")}
                </Link>
                <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
                  {t("signup")}
                </Link>
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
