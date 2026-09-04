import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="container w-full py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold text-foreground">{t("about")}</h3>
            <p className="text-sm text-muted-foreground">{t("aboutText")}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("candidates")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jobs" className="hover:text-foreground">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate/onboarding" className="hover:text-foreground">
                  Career Passport
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("employers")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/employer/onboarding" className="hover:text-foreground">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employer" className="hover:text-foreground">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>{t("copyright", { year })}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
