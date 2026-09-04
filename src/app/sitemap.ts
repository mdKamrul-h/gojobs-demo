import type { MetadataRoute } from "next";
import { jobs } from "@/lib/mock/fixtures/jobs";
import { companies } from "@/lib/mock/fixtures/companies";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gojobs.bd";

  const staticPages = ["", "/jobs", "/companies"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const job of jobs.filter((j) => j.status === "published")) {
      entries.push({
        url: `${baseUrl}/${locale}/jobs/${job.slug}`,
        lastModified: new Date(job.postedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const company of companies) {
      entries.push({
        url: `${baseUrl}/${locale}/companies/${company.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
