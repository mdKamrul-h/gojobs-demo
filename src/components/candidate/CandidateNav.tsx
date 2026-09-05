"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  LayoutDashboard,
  FileUser,
  ClipboardList,
  Bookmark,
  Sparkles,
  Video,
  Bot,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const desktopItems = [
  { href: "/candidate", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/candidate/passport", icon: FileUser, key: "passport" as const },
  { href: "/candidate/applications", icon: ClipboardList, key: "applications" as const },
  { href: "/candidate/interviews", icon: Video, key: "interviews" as const },
  { href: "/candidate/saved", icon: Bookmark, key: "saved" as const },
  { href: "/candidate/agent", icon: Bot, key: "agent" as const },
  { href: "/candidate/onboarding", icon: Sparkles, key: "onboarding" as const },
];

const tabs = [
  { href: "/candidate", icon: LayoutDashboard, key: "home" as const, exact: true },
  { href: "/candidate/passport", icon: FileUser, key: "passport" as const },
  { href: "/candidate/applications", icon: ClipboardList, key: "applications" as const },
  { href: "/candidate/interviews", icon: Video, key: "interviews" as const },
];

const moreItems = [
  { href: "/candidate/saved", icon: Bookmark, key: "saved" as const },
  { href: "/candidate/agent", icon: Bot, key: "agent" as const },
  { href: "/candidate/onboarding", icon: Sparkles, key: "onboarding" as const },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function CandidateNav() {
  const t = useTranslations("candidate.nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="mb-8 hidden flex-wrap gap-1 rounded-lg border bg-muted/30 p-1 md:flex">
        {desktopItems.map(({ href, icon: Icon, key }) => {
          const active = isActive(pathname, href, href === "/candidate");
          return (
            <Link
              key={href}
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

      <div className="h-16 md:hidden" />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {tabs.map(({ href, icon: Icon, key, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
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
        </div>
      </nav>
    </>
  );
}
