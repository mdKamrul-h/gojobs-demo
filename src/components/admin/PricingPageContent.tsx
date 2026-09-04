"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBDT } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

interface PricingPageContentProps {
  locale: Locale;
}

const jobPackages = [
  { id: "single", posts: 1, price: 2500, popular: false },
  { id: "bundle5", posts: 5, price: 10000, popular: true },
  { id: "bundle10", posts: 10, price: 18000, popular: false },
] as const;

const subscriptionTiers = [
  {
    id: "starter",
    price: 4999,
    jobPosts: 3,
    featured: 0,
    teamSeats: 2,
    popular: false,
  },
  {
    id: "growth",
    price: 14999,
    jobPosts: 10,
    featured: 2,
    teamSeats: 5,
    popular: true,
  },
  {
    id: "enterprise",
    price: 49999,
    jobPosts: 50,
    featured: 10,
    teamSeats: 20,
    popular: false,
  },
] as const;

export function PricingPageContent({ locale }: PricingPageContentProps) {
  const t = useTranslations("pricing");
  const formatPrice = (amount: number) => formatBDT(amount, locale === "bn" ? "bn-BD" : "en-BD");

  return (
    <div className="container mx-auto space-y-12 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="packages" className="mx-auto max-w-5xl">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages">{t("tabs.packages")}</TabsTrigger>
          <TabsTrigger value="subscriptions">{t("tabs.subscriptions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            {jobPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={pkg.popular ? "border-primary shadow-md" : undefined}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t(`packages.${pkg.id}.name`)}</CardTitle>
                    {pkg.popular && <Badge>{t("popular")}</Badge>}
                  </div>
                  <CardDescription>{t(`packages.${pkg.id}.description`)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">{formatPrice(pkg.price)}</span>
                    <span className="text-muted-foreground"> / {t("oneTime")}</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.posts", { count: pkg.posts })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.daysActive", { days: 30 })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.applicantTracking")}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/employer/onboarding" className="w-full">
                    <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                      {t("getStarted")}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.id}
                className={tier.popular ? "border-primary shadow-md" : undefined}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t(`subscriptions.${tier.id}.name`)}</CardTitle>
                    {tier.popular && <Badge>{t("popular")}</Badge>}
                  </div>
                  <CardDescription>{t(`subscriptions.${tier.id}.description`)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">{formatPrice(tier.price)}</span>
                    <span className="text-muted-foreground"> / {t("perMonth")}</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.posts", { count: tier.jobPosts })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.featured", { count: tier.featured })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.teamSeats", { count: tier.teamSeats })}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {t("features.prioritySupport")}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/employer/billing" className="w-full">
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      {t("subscribe")}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">{t("footnote")}</p>
    </div>
  );
}
