import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompanyCard } from "@/components/marketplace";
import { getCompanies } from "@/lib/mock/services/companies";
import { getJobsByCompanyId } from "@/lib/mock/fixtures/jobs";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CompaniesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("companies");

  const companies = await getCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const openJobs = getJobsByCompanyId(company.id).length;
          return (
            <CompanyCard
              key={company.id}
              company={company}
              openJobsCount={openJobs}
            />
          );
        })}
      </div>
    </div>
  );
}
