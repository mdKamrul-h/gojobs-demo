import { companies } from "../fixtures/companies";
import { jobs } from "../fixtures/jobs";

export function getMarketplaceStats() {
  const published = jobs.filter((job) => job.status === "published");
  const cities = new Set(published.map((job) => job.location.districtId));
  const verifiedEmployers = companies.filter(
    (company) => company.trustStatus === "approved"
  );

  return {
    openRoles: published.length,
    cities: cities.size,
    verifiedEmployers: verifiedEmployers.length,
    featuredEmployers: verifiedEmployers.slice(0, 6),
  };
}
