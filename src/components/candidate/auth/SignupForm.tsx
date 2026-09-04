"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useDemoAuth } from "@/lib/mock/auth/demo-auth-context";
import { createCandidateProfile } from "@/lib/mock/services/candidates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, User } from "lucide-react";

export function SignupForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { signup } = useDemoAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = signup({ email, name, role });
    if (role === "candidate") {
      await createCandidateProfile({
        userId: user.id,
        name: user.name,
        email: user.email,
      });
      router.push("/candidate/onboarding");
    } else {
      router.push("/employer/onboarding");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("signupTitle")}</CardTitle>
          <CardDescription>{t("signupSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("roleLabel")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                    role === "candidate"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <User className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{t("roleCandidate")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                    role === "recruiter"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Briefcase className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{t("roleEmployer")}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                placeholder={t("namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {t("signupButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("loginButton")}
        </Link>
      </p>
    </div>
  );
}
