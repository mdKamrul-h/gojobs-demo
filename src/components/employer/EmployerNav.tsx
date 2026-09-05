"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Video,
  Bot,
  Settings,
  Briefcase,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const desktopItems = [
  { href: "/employer", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/employer/talent-search", icon: Users, key: "talentSearch" as const },
  { href: "/employer/assessments", icon: ClipboardCheck, key: "assessments" as const },
  { href: "/employer/interviews", icon: Video, key: "interviews" as const },
  { href: "/employer/agent", icon: Bot, key: "agent" as const },
  { href: "/employer/enterprise", icon: Settings, key: "enterprise" as const },
  { href: "/employer/jobs/new", icon: Plus, key: "postJob" as const },
];

const tabs = [
  { href: "/employer", icon: LayoutDashboard, key: "home" as const, exact: true },
  { href: "/employer#open-jobs", icon: Briefcase, key: "jobs" as const, match: "/employer/jobs" },
  { href: "/employer/talent-search", icon: Users, key: "talent" as const },
  { href: "/employer/interviews", icon: Video, key: "interviews" as const },
];

const moreItems = [
  { href: "/employer/assessments", icon: ClipboardCheck, key: "assessments" as const },
  { href: "/employer/agent", icon: Bot, key: "agent" as const },
  { href: "/employer/enterprise", icon: Settings, key: "enterprise" as const },
];

export function EmployerNav() {
  const t = useTranslations("employer.nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="mb-8 hidden flex-wrap gap-1 rounded-lg border bg-muted/30 p-1 md:flex">
        {desktopItems.map(({ href, icon: Icon, key }) => {
          const active =
            href === "/employer"
              ? pathname === "/employer"
              : pathname.startsWith(href);
          return (
            <Link
              key={`${href}-${key}`}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="h-24 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="flex justify-end px-3 pt-2">
          <Link
            href="/employer/jobs/new"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="h-4 w-4" />
            {t("postJob")}
          </Link>
        </div>
        <nav className="grid grid-cols-5">
          {tabs.map(({ href, icon: Icon, key, exact, match }) => {
            const active = match
              ? pathname.startsWith(match)
              : exact
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={`${href}-${key}`}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{t(key)}</span>
              </Link>
            );
          })}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium text-muted-foreground"
                />
              }
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>{t("more")}</span>
            </SheetTrigger>
            <SheetContent side="bottom" className="md:hidden">
              <SheetHeader>
                <SheetTitle>{tCommon("more")}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 px-4 pb-6">
                {moreItems.map(({ href, icon: Icon, key }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {t(key)}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
}
