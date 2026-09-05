import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { divisions } from "@/lib/mock/fixtures/locations";
import type { Occupation } from "@/lib/types";

const CATEGORIES: { occupation: Occupation; icon: string }[] = [
  { occupation: "accountant", icon: "📊" },
  { occupation: "hr_manager", icon: "👥" },
  { occupation: "rmg_merchandiser", icon: "👔" },
  { occupation: "sales_executive", icon: "💼" },
  { occupation: "software_engineer", icon: "💻" },
];

const LOCATION_CHIPS = [
  { division: "dhaka" },
  { division: "chittagong" },
  { division: "dhaka", district: "gazipur" },
];

export async function BrowseSections() {
  const t = await getTranslations("home");
  const tJobs = await getTranslations("jobs");
  const locale = await getLocale();

  return (
    <>
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">{t("browseCategories")}</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(({ occupation, icon }) => (
            <Link key={occupation} href={`/jobs?occupation=${occupation}`}>
              <Badge
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/5"
              >
                <span className="mr-2">{icon}</span>
                {tJobs(`occupation.${occupation}`)}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-2xl font-bold">{t("browseLocations")}</h2>
          <div className="flex flex-wrap gap-3">
            {LOCATION_CHIPS.map((loc) => {
              const division = divisions.find((d) => d.id === loc.division);
              const district = loc.district
                ? division?.districts.find((d) => d.id === loc.district)
                : undefined;
              const label = locale === "bn"
                ? (district?.nameBn ?? division?.nameBn ?? loc.division)
                : (district?.name ?? division?.name ?? loc.division);
              const params = new URLSearchParams();
              params.set("division", loc.division);
              if (loc.district) params.set("district", loc.district);
              return (
                <Link key={label} href={`/jobs?${params.toString()}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-secondary/80"
                  >
                    {label}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
