"use client";

import {
  AlertTriangle,
  Briefcase,
  Building2,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryDisplay } from "@/components/shared";
import type { FlagReason, FlaggedJob, PlatformStats } from "./admin-data";
import type { Company } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

interface AdminDashboardProps {
  stats: PlatformStats;
  flaggedJobs: FlaggedJob[];
  trustQueue: Company[];
  locale: Locale;
}

const flagVariant: Record<FlagReason, "destructive" | "secondary" | "outline"> = {
  unverified_employer: "destructive",
  salary_mismatch: "secondary",
  high_applicants: "outline",
  duplicate_title: "outline",
};

export function AdminDashboard({ stats, flaggedJobs, trustQueue, locale }: AdminDashboardProps) {
  const t = useTranslations("admin");

  const statCards = [
    {
      label: t("stats.jobs"),
      value: stats.publishedJobs,
      icon: Briefcase,
      description: t("stats.jobsDesc"),
    },
    {
      label: t("stats.companies"),
      value: stats.totalCompanies,
      icon: Building2,
      description: t("stats.companiesDesc"),
    },
    {
      label: t("stats.applications"),
      value: stats.totalApplications,
      icon: FileText,
      description: t("stats.applicationsDesc"),
    },
    {
      label: t("stats.pendingReviews"),
      value: stats.pendingTrustReviews,
      icon: ShieldCheck,
      description: t("stats.pendingReviewsDesc"),
    },
  ];

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="moderation">
        <TabsList>
          <TabsTrigger value="moderation" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("moderation.title")}
            {flaggedJobs.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5">
                {flaggedJobs.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="trust" className="gap-2">
            <Users className="h-4 w-4" />
            {t("trust.title")}
            {trustQueue.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                {trustQueue.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("moderation.title")}</CardTitle>
              <CardDescription>{t("moderation.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {flaggedJobs.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {t("moderation.empty")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("moderation.job")}</TableHead>
                      <TableHead>{t("moderation.company")}</TableHead>
                      <TableHead>{t("moderation.salary")}</TableHead>
                      <TableHead>{t("moderation.flags")}</TableHead>
                      <TableHead>{t("moderation.applicants")}</TableHead>
                      <TableHead className="text-right">{t("moderation.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flaggedJobs.map(({ job, company, reasons }) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{company?.name ?? "—"}</TableCell>
                        <TableCell>
                          <SalaryDisplay salary={job.salary} locale={locale} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {reasons.map((reason) => (
                              <Badge key={reason} variant={flagVariant[reason]}>
                                {t(`moderation.reasons.${reason}`)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{job.applicantCount ?? 0}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled>
                            {t("moderation.review")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trust" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("trust.title")}</CardTitle>
              <CardDescription>{t("trust.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {trustQueue.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("trust.empty")}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("trust.company")}</TableHead>
                      <TableHead>{t("trust.industry")}</TableHead>
                      <TableHead>{t("trust.size")}</TableHead>
                      <TableHead>{t("trust.founded")}</TableHead>
                      <TableHead>{t("trust.status")}</TableHead>
                      <TableHead className="text-right">{t("trust.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trustQueue.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            {company.website && (
                              <p className="text-xs text-muted-foreground">{company.website}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{company.industry.replace("_", " ")}</TableCell>
                        <TableCell>{company.size}</TableCell>
                        <TableCell>{company.foundedYear ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t("trust.pending")}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/companies/${company.slug}`}>
                              <Button variant="ghost" size="sm">
                                {t("trust.view")}
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" disabled>
                              {t("trust.review")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
