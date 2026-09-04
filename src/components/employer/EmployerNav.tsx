"use client";

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
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/employer", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/employer/talent-search", icon: Users, key: "talentSearch" as const },
  { href: "/employer/assessments", icon: ClipboardCheck, key: "assessments" as const },
  { href: "/employer/interviews", icon: Video, key: "interviews" as const },
  { href: "/employer/agent", icon: Bot, key: "agent" as const },
  { href: "/employer/enterprise", icon: Settings, key: "enterprise" as const },
  { href: "/employer/jobs/new", icon: FileText, key: "postJob" as const },
];

export function EmployerNav() {
  const t = useTranslations("employer.nav");
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
      {navItems.map(({ href, icon: Icon, key }) => {
        const isActive =
          href === "/employer"
            ? pathname === "/employer"
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
