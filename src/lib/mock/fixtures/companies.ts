import type { Company } from "@/lib/types";

export const companies: Company[] = [
  {
    id: "comp-brac-bank",
    slug: "brac-bank",
    name: "BRAC Bank Limited",
    industry: "banking",
    size: "1000+",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "gulshan" },
    website: "https://www.bracbank.com",
    description:
      "Leading private commercial bank in Bangladesh offering retail, SME, and corporate banking services.",
    trustStatus: "approved",
    foundedYear: 2001,
    employeeCount: 8500,
  },
  {
    id: "comp-square-pharma",
    slug: "square-pharmaceuticals",
    name: "Square Pharmaceuticals",
    industry: "manufacturing",
    size: "1000+",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "motijheel" },
    website: "https://www.squarepharma.com.bd",
    description:
      "One of the largest pharmaceutical companies in Bangladesh, manufacturing and exporting medicines globally.",
    trustStatus: "approved",
    foundedYear: 1958,
    employeeCount: 12000,
  },
  {
    id: "comp-ha-meem",
    slug: "ha-meem-group",
    name: "Ha-Meem Group",
    industry: "rmg",
    size: "1000+",
    location: { divisionId: "dhaka", districtId: "gazipur" },
    website: "https://www.hameemgroup.net",
    description:
      "Major RMG exporter with integrated manufacturing facilities in Gazipur and Ashulia.",
    trustStatus: "approved",
    foundedYear: 1984,
    employeeCount: 35000,
  },
  {
    id: "comp-brac-ngo",
    slug: "brac",
    name: "BRAC",
    industry: "ngo",
    size: "1000+",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "uttara" },
    website: "https://www.brac.net",
    description:
      "World's largest NGO, working on poverty alleviation, education, health, and social enterprise across Bangladesh.",
    trustStatus: "approved",
    foundedYear: 1972,
    employeeCount: 90000,
  },
  {
    id: "comp-bkash",
    slug: "bkash",
    name: "bKash Limited",
    industry: "technology",
    size: "501-1000",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "gulshan" },
    website: "https://www.bkash.com",
    description:
      "Bangladesh's leading mobile financial services provider enabling digital payments for millions.",
    trustStatus: "approved",
    foundedYear: 2010,
    employeeCount: 3500,
  },
  {
    id: "comp-walton",
    slug: "walton",
    name: "Walton Hi-Tech Industries",
    industry: "manufacturing",
    size: "1000+",
    location: { divisionId: "dhaka", districtId: "gazipur" },
    website: "https://www.waltonbd.com",
    description:
      "Leading electronics and home appliance manufacturer with strong domestic and export presence.",
    trustStatus: "approved",
    foundedYear: 1977,
    employeeCount: 40000,
  },
  {
    id: "comp-startup-labs",
    slug: "startup-labs-bd",
    name: "Startup Labs BD",
    industry: "technology",
    size: "11-50",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "banani" },
    website: "https://startuplabs.bd",
    description:
      "Early-stage tech startup building SaaS products for Bangladesh SMEs.",
    trustStatus: "pending",
    foundedYear: 2022,
    employeeCount: 28,
  },
  {
    id: "comp-apex-footwear",
    slug: "apex-footwear",
    name: "Apex Footwear Limited",
    industry: "manufacturing",
    size: "501-1000",
    location: { divisionId: "dhaka", districtId: "gazipur" },
    website: "https://www.apexfootwearltd.com",
    description:
      "Leading footwear manufacturer and retailer with export operations across Asia and Europe.",
    trustStatus: "approved",
    foundedYear: 1990,
    employeeCount: 5000,
  },
  {
    id: "comp-unilever-bd",
    slug: "unilever-bangladesh",
    name: "Unilever Bangladesh",
    industry: "retail",
    size: "501-1000",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "tejgaon" },
    website: "https://www.unilever.com.bd",
    description:
      "Multinational FMCG company with strong brands in personal care, home care, and foods.",
    trustStatus: "approved",
    foundedYear: 1964,
    employeeCount: 2000,
  },
  {
    id: "comp-pragati-insurance",
    slug: "pragati-insurance",
    name: "Pragati Insurance Limited",
    industry: "banking",
    size: "51-200",
    location: { divisionId: "chittagong", districtId: "chittagong-metro" },
    website: "https://www.pragatiinsurance.com",
    description:
      "General insurance company offering motor, fire, marine, and health insurance products.",
    trustStatus: "approved",
    foundedYear: 1986,
    employeeCount: 350,
  },
  {
    id: "comp-digital-health",
    slug: "digital-health-bd",
    name: "Digital Health BD",
    industry: "healthcare",
    size: "51-200",
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "dhanmondi" },
    description:
      "Health-tech startup connecting patients with doctors via telemedicine platform.",
    trustStatus: "pending",
    foundedYear: 2021,
    employeeCount: 85,
  },
  {
    id: "comp-education-plus",
    slug: "education-plus",
    name: "Education Plus",
    industry: "education",
    size: "11-50",
    location: { divisionId: "sylhet", districtId: "sylhet-metro" },
    description:
      "EdTech company providing online tutoring and exam preparation for HSC and admission tests.",
    trustStatus: "approved",
    foundedYear: 2019,
    employeeCount: 45,
  },
];

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}
