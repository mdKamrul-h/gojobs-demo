"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, LogOut } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/jobs", key: "jobs" as const },
  { href: "/companies", key: "companies" as const },
  { href: "/campus", key: "campus" as const },
  { href: "/frontline", key: "frontline" as const },
  { href: "/pricing", key: "pricing" as const },
];

export function MobileNav() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAuthenticated, logout } = useDemoAuth();
  const [open, setOpen] = useState(false);

  const dashboardHref =
    role === "candidate"
      ? "/candidate"
      : role === "recruiter"
        ? "/employer"
        : role === "admin"
          ? "/admin"
          : "/";

  function close() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    close();
    router.push("/");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={tCommon("openMenu")}
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="md:hidden">
        <SheetHeader>
          <SheetTitle>{tCommon("menu")}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6">
          {publicLinks.map(({ href, key }) => {
            const current = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-3 text-base font-medium",
                  current
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={close}
                  className={cn(buttonVariants(), "w-full")}
                >
                  {t("dashboard")}
                </Link>
                <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className={cn(buttonVariants(), "w-full")}
                >
                  {t("signup")}
                </Link>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
