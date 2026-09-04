import type { User } from "@/lib/types";

export const users: User[] = [
  {
    id: "user-candidate-1",
    email: "rahima.akter@email.com",
    name: "Rahima Akter",
    role: "candidate",
    candidateId: "cand-001",
  },
  {
    id: "user-candidate-2",
    email: "karim.hasan@email.com",
    name: "Karim Hasan",
    role: "candidate",
    candidateId: "cand-002",
  },
  {
    id: "user-candidate-3",
    email: "nusrat.jahan@email.com",
    name: "Nusrat Jahan",
    role: "candidate",
    candidateId: "cand-003",
  },
  {
    id: "user-candidate-4",
    email: "tanvir.ahmed@email.com",
    name: "Tanvir Ahmed",
    role: "candidate",
    candidateId: "cand-004",
  },
  {
    id: "user-candidate-5",
    email: "farhana.yasmin@email.com",
    name: "Farhana Yasmin",
    role: "candidate",
    candidateId: "cand-005",
  },
  {
    id: "user-recruiter-1",
    email: "recruiter@bkash.com",
    name: "Sabrina Rahman",
    role: "recruiter",
    companyId: "comp-bkash",
  },
  {
    id: "user-recruiter-2",
    email: "hr@ha-meem.com",
    name: "Mohammad Ali",
    role: "recruiter",
    companyId: "comp-ha-meem",
  },
  {
    id: "user-admin-1",
    email: "admin@gojobs.bd",
    name: "Admin User",
    role: "admin",
  },
];

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersByRole(role: User["role"]): User[] {
  return users.filter((u) => u.role === role);
}
