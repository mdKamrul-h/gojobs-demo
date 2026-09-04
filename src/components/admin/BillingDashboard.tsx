"use client";

import { CreditCard, Download, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Progress,
} from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

interface BillingDashboardProps {
  locale: Locale;
}

const currentPlan = {
  tier: "growth" as const,
  price: 14999,
  renewsAt: "2026-04-01",
};

const usage = {
  jobPosts: { used: 3, limit: 10 },
  featuredSlots: { used: 1, limit: 2 },
  teamSeats: { used: 4, limit: 5 },
};

const invoices = [
  { id: "INV-2026-003", date: "2026-03-01", amount: 14999, status: "paid" as const },
  { id: "INV-2026-002", date: "2026-02-01", amount: 14999, status: "paid" as const },
  { id: "INV-2026-001", date: "2026-01-01", amount: 14999, status: "paid" as const },
  { id: "INV-2025-012", date: "2025-12-01", amount: 10000, status: "paid" as const },
  { id: "INV-2025-011", date: "2025-11-15", amount: 2500, status: "paid" as const },
];

function usagePercent(used: number, limit: number): number {
  return Math.round((used / limit) * 100);
}

export function BillingDashboard({ locale }: BillingDashboardProps) {
  const t = useTranslations("billing");
  const formatPrice = (amount: number) => formatBDT(amount, locale === "bn" ? "bn-BD" : "en-BD");
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));

  return (
    <PageContainer className="space-y-8">
      <EmployerNav />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("changePlan")}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("currentPlan.title")}
            </CardTitle>
            <CardDescription>{t("currentPlan.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-semibold">
                {t(`plans.${currentPlan.tier}`)}
              </span>
              <Badge>{t("currentPlan.active")}</Badge>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span>
                {formatPrice(currentPlan.price)} / {t("perMonth")}
              </span>
              <span>
                {t("currentPlan.renews")}: {formatDate(currentPlan.renewsAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {t("paymentMethod.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{t("paymentMethod.bkash")}</p>
            <p className="text-muted-foreground">•••• 4521</p>
            <Button variant="ghost" size="sm" className="mt-2 px-0" disabled>
              {t("paymentMethod.update")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("usage.title")}</CardTitle>
          <CardDescription>{t("usage.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("usage.jobPosts")}</span>
              <span className="text-muted-foreground">
                {usage.jobPosts.used} / {usage.jobPosts.limit}
              </span>
            </div>
            <Progress value={usagePercent(usage.jobPosts.used, usage.jobPosts.limit)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("usage.featured")}</span>
              <span className="text-muted-foreground">
                {usage.featuredSlots.used} / {usage.featuredSlots.limit}
              </span>
            </div>
            <Progress value={usagePercent(usage.featuredSlots.used, usage.featuredSlots.limit)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("usage.teamSeats")}</span>
              <span className="text-muted-foreground">
                {usage.teamSeats.used} / {usage.teamSeats.limit}
              </span>
            </div>
            <Progress value={usagePercent(usage.teamSeats.used, usage.teamSeats.limit)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("invoices.title")}</CardTitle>
          <CardDescription>{t("invoices.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoices.id")}</TableHead>
                <TableHead>{t("invoices.date")}</TableHead>
                <TableHead>{t("invoices.amount")}</TableHead>
                <TableHead>{t("invoices.status")}</TableHead>
                <TableHead className="text-right">{t("invoices.download")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatPrice(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t(`invoices.statuses.${invoice.status}`)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      <Download className="mr-1 h-4 w-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
