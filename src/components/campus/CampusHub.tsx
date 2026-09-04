"use client";

import { useTranslations } from "next-intl";
import { GraduationCap, Briefcase } from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campusUniversities, campusInternships } from "@/lib/mock/fixtures/campus";

export function CampusHub() {
  const t = useTranslations("campus");

  return (
    <PageContainer className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <GraduationCap className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t("universities")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {campusUniversities.map((uni) => (
            <Card key={uni.id}>
              <CardHeader>
                <CardTitle className="text-base">{uni.name}</CardTitle>
                <CardDescription>{uni.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {uni.programs.slice(0, 3).map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{t("internships", { count: uni.internshipCount })}</span>
                  <span>{t("graduatePrograms", { count: uni.graduateProgramCount })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {t("featuredInternships")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campusInternships.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.company} · {item.university}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.duration}</span>
                <span className="font-medium">{item.stipend}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
