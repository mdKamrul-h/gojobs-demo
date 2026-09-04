import type { Location } from "./location";
import type { TrustStatus } from "./common";

export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export type Industry =
  | "banking"
  | "rmg"
  | "ngo"
  | "technology"
  | "manufacturing"
  | "retail"
  | "healthcare"
  | "education";

export interface Company {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  industry: Industry;
  size: CompanySize;
  location: Location;
  website?: string;
  description: string;
  trustStatus: TrustStatus;
  foundedYear?: number;
  employeeCount?: number;
}
