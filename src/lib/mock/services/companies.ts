import type { Company } from "@/lib/types";
import {
  companies,
  getCompanyById,
  getCompanyBySlug,
} from "../fixtures/companies";
import { mockDelay } from "../delay";

export async function getCompanies(): Promise<Company[]> {
  await mockDelay();
  return companies;
}

export async function getCompanyBySlugAsync(slug: string): Promise<Company | undefined> {
  await mockDelay();
  return getCompanyBySlug(slug);
}

export async function getCompanyByIdAsync(id: string): Promise<Company | undefined> {
  await mockDelay();
  return getCompanyById(id);
}

export { companies };
