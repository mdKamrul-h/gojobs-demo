"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/candidate", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/candidate/passport", icon: FileUser, key: "passport" as const },
  { href: "/candidate/applications", icon: ClipboardList, key: "applications" as const },
  { href: "/candidate/interviews", icon: Video, key: "interviews" as const },
  { href: "/candidate/saved", icon: Bookmark, key: "saved" as const },
  { href: "/candidate/agent", icon: Bot, key: "agent" as const },
  { href: "/candidate/onboarding", icon: Sparkles, key: "onboarding" as const },
];

export function CandidateNav() {
  const t = useTranslations("candidate.nav");
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
      {navItems.map(({ href, icon: Icon, key }) => {
        const isActive =
          href === "/candidate"
            ? pathname === "/candidate"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
