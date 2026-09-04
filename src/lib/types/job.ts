import type {
  JobStatus,
  Requirement,
  SalaryRange,
  ScreeningQuestion,
  WorkMode,
} from "./common";
import type { Location } from "./location";

export type Occupation =
  | "accountant"
  | "hr_manager"
  | "sales_executive"
  | "rmg_merchandiser"
  | "software_engineer"
  | "marketing_manager"
  | "operations_manager"
  | "customer_service";

export type Seniority = "entry" | "mid" | "senior" | "lead" | "manager";

export interface Job {
  id: string;
  slug: string;
  title: string;
  occupation: Occupation;
  seniority: Seniority;
  companyId: string;
  location: Location;
  salary: SalaryRange;
  workMode: WorkMode;
  hardRequirements: Requirement[];
  softRequirements: Requirement[];
  description: string;
  responsibilities: string[];
  screeningQuestions: ScreeningQuestion[];
  status: JobStatus;
  featured?: boolean;
  postedAt: string;
  closesAt?: string;
  applicantCount?: number;
}
