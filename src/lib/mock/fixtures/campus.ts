export interface CampusUniversity {
  id: string;
  name: string;
  location: string;
  programs: string[];
  internshipCount: number;
  graduateProgramCount: number;
}

export interface CampusInternship {
  id: string;
  title: string;
  company: string;
  university: string;
  duration: string;
  stipend: string;
}

export const campusUniversities: CampusUniversity[] = [
  {
    id: "du",
    name: "University of Dhaka",
    location: "Dhaka",
    programs: ["BBA", "MBA", "Computer Science", "Economics"],
    internshipCount: 45,
    graduateProgramCount: 12,
  },
  {
    id: "buet",
    name: "BUET",
    location: "Dhaka",
    programs: ["CSE", "EEE", "Mechanical Engineering"],
    internshipCount: 38,
    graduateProgramCount: 8,
  },
  {
    id: "nsu",
    name: "North South University",
    location: "Dhaka",
    programs: ["BBA", "LLB", "Pharmacy", "CSE"],
    internshipCount: 52,
    graduateProgramCount: 15,
  },
];

export const campusInternships: CampusInternship[] = [
  {
    id: "ci-1",
    title: "Finance Intern",
    company: "BRAC Bank",
    university: "University of Dhaka",
    duration: "3 months",
    stipend: "৳15,000/month",
  },
  {
    id: "ci-2",
    title: "Software Engineering Intern",
    company: "bKash",
    university: "BUET",
    duration: "6 months",
    stipend: "৳25,000/month",
  },
  {
    id: "ci-3",
    title: "Marketing Graduate Trainee",
    company: "Unilever Bangladesh",
    university: "North South University",
    duration: "12 months",
    stipend: "৳35,000/month",
  },
];
