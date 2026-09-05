import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { companyInitials } from "@/lib/utils/format";
import type { Company } from "@/lib/types";

export async function FeaturedEmployers({ companies }: { companies: Company[] }) {
  const t = await getTranslations("home");

  if (companies.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">{t("featuredEmployers")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/companies/${company.slug}`}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-muted/40"
          >
            <Avatar className="rounded-lg">
              <AvatarFallback className="rounded-lg">
                {companyInitials(company.name)}
              </AvatarFallback>
            </Avatar>
            <span className="line-clamp-2 text-sm font-medium">{company.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
