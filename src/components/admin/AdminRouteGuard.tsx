"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const t = useTranslations("admin");
  const { role, isAuthenticated } = useDemoAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="max-w-md text-center">
          <CardHeader>
            <ShieldAlert className="mx-auto mb-2 h-12 w-12 text-destructive" />
            <CardTitle>{t("accessDenied")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("accessDeniedHint")}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">{t("backHome")}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
