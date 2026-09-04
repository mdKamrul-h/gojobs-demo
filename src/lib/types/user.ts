import type { UserRole } from "./common";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  companyId?: string;
  candidateId?: string;
}
