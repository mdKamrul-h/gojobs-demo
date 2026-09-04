"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useDemoAuth, demoUsers } from "@/lib/mock/auth/demo-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function LoginForm() {
  const t = useTranslations("auth");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const { login, loginWithEmail } = useDemoAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginWithEmail(email);
      router.push("/candidate");
    }
  };

  const handleDemoLogin = (userId: string, role: string) => {
    login(userId);
    router.push(
      role === "candidate"
        ? "/candidate"
        : role === "recruiter"
          ? "/employer"
          : role === "admin"
            ? "/admin"
            : "/"
    );
  };

  const demoCandidates = demoUsers.filter((u) => u.role === "candidate").slice(0, 3);
  const demoRecruiters = demoUsers.filter((u) => u.role === "recruiter");
  const demoAdmins = demoUsers.filter((u) => u.role === "admin");

  const renderDemoUser = (user: (typeof demoUsers)[number]) => (
    <button
      key={user.id}
      type="button"
      onClick={() => handleDemoLogin(user.id, user.role)}
      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
    >
      <Avatar className="h-9 w-9">
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Badge variant="secondary">{tRoles(user.role)}</Badge>
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
          <CardDescription>{t("loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("demoNote")}</p>
            <Button type="submit" className="w-full">
              {t("loginButton")}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">{t("orDivider")}</span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">{t("demoUsers")}</p>
            <p className="text-xs text-muted-foreground">{t("demoAccountsHint")}</p>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tRoles("candidate")}
              </p>
              {demoCandidates.map(renderDemoUser)}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tRoles("recruiter")}
              </p>
              {demoRecruiters.map(renderDemoUser)}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tRoles("admin")}
              </p>
              {demoAdmins.map(renderDemoUser)}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          {t("signupButton")}
        </Link>
      </p>
    </div>
  );
}
