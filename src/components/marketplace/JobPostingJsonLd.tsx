import type { Company, Job } from "@/lib/types";

interface JobPostingJsonLdProps {
  job: Job;
  company: Company;
  locale: string;
}

export function JobPostingJsonLd({ job, company, locale }: JobPostingJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gojobs.bd";
  const url = `${baseUrl}/${locale}/jobs/${job.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    validThrough: job.closesAt,
    employmentType: job.workMode === "remote" ? "TELECOMMUTE" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
      sameAs: company.website,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressRegion: job.location.divisionId,
        addressLocality: job.location.districtId,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "BDT",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: job.salary.period === "monthly" ? "MONTH" : "YEAR",
      },
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
