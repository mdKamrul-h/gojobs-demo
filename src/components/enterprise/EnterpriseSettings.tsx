"use client";

import { useTranslations } from "next-intl";
import { Key, Webhook, Users, Shield } from "lucide-react";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EnterpriseSettings() {
  const t = useTranslations("enterprise");

  return (
    <PageContainer className="space-y-8">
      <EmployerNav />
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="sso">
        <TabsList>
          <TabsTrigger value="sso">{t("tabs.sso")}</TabsTrigger>
          <TabsTrigger value="api">{t("tabs.api")}</TabsTrigger>
          <TabsTrigger value="webhooks">{t("tabs.webhooks")}</TabsTrigger>
          <TabsTrigger value="team">{t("tabs.team")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                {t("sso.title")}
              </CardTitle>
              <CardDescription>{t("sso.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("sso.provider")}</Label>
                <Input placeholder="SAML 2.0 / OIDC" disabled />
              </div>
              <div className="space-y-2">
                <Label>{t("sso.domain")}</Label>
                <Input placeholder="company.com" />
              </div>
              <Button variant="outline">{t("sso.configure")}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4" />
                {t("api.title")}
              </CardTitle>
              <CardDescription>{t("api.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-3 font-mono text-sm">
                gj_live_••••••••••••••••
              </div>
              <Button variant="outline">{t("api.rotate")}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Webhook className="h-4 w-4" />
                {t("webhooks.title")}
              </CardTitle>
              <CardDescription>{t("webhooks.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("webhooks.url")}</Label>
                <Input placeholder="https://api.company.com/webhooks/gojobs" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["application.created", "stage.changed", "offer.sent"].map((event) => (
                  <Badge key={event} variant="secondary">
                    {event}
                  </Badge>
                ))}
              </div>
              <Button variant="outline">{t("webhooks.save")}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                {t("team.title")}
              </CardTitle>
              <CardDescription>{t("team.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Admin User", role: "admin", email: "admin@company.com" },
                { name: "Recruiter", role: "recruiter", email: "hr@company.com" },
                { name: "Viewer", role: "viewer", email: "ops@company.com" },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge variant="outline">{t(`team.roles.${member.role}`)}</Badge>
                </div>
              ))}
              <Button variant="outline">{t("team.invite")}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
