import type { Candidate } from "@/lib/types";

export const candidates: Candidate[] = [
  {
    id: "cand-001",
    userId: "user-candidate-1",
    name: "Rahima Akter",
    passport: {
      headline: "Senior Accountant | CA Finalist | VAT & Tax Specialist",
      summary:
        "Experienced accountant with 6 years in banking and manufacturing sectors. Strong expertise in VAT compliance, financial reporting, and audit coordination.",
      phone: "+8801712345678",
      email: "rahima.akter@email.com",
      experience: [
        {
          id: "exp-1",
          title: "Senior Accountant",
          company: "Mutual Trust Bank",
          location: "Dhaka",
          startDate: "2021-03",
          current: true,
          responsibilities: [
            "Prepare monthly financial statements",
            "Manage VAT returns and NBR compliance",
            "Coordinate external audits",
          ],
          achievements: ["Reduced audit findings by 40%", "Implemented automated reconciliation"],
        },
        {
          id: "exp-2",
          title: "Accounts Executive",
          company: "Akij Group",
          location: "Dhaka",
          startDate: "2018-06",
          endDate: "2021-02",
          current: false,
          responsibilities: ["Process vendor payments", "Bank reconciliation", "Fixed asset management"],
          achievements: ["Streamlined payment processing"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "University of Dhaka",
          degree: "M.Com",
          field: "Accounting",
          startDate: "2016",
          endDate: "2018",
          current: false,
        },
      ],
      skills: [
        { id: "sk-1", name: "VAT Compliance", level: "expert", evidence: "candidate_provided" },
        { id: "sk-2", name: "Financial Reporting", level: "advanced", evidence: "cv_extracted" },
        { id: "sk-3", name: "Tax Planning", level: "advanced", evidence: "assessment_derived" },
        { id: "sk-4", name: "MS Excel", level: "expert", evidence: "candidate_provided" },
        { id: "sk-5", name: "Audit Coordination", level: "advanced", evidence: "cv_extracted" },
      ],
      preferences: {
        desiredRoles: ["Senior Accountant", "Tax Consultant", "Financial Analyst"],
        salaryExpectation: { min: 80000, max: 120000, currency: "BDT", period: "monthly" },
        preferredLocations: [{ divisionId: "dhaka", districtId: "dhaka-metro" }],
        workMode: ["on_site", "hybrid"],
        noticePeriodDays: 60,
      },
      visibility: "actively_looking",
      completeness: 92,
    },
    savedJobIds: ["job-001", "job-017", "job-025"],
  },
  {
    id: "cand-002",
    userId: "user-candidate-2",
    name: "Karim Hasan",
    passport: {
      headline: "HR Manager | RMG Specialist | 8 Years Experience",
      summary:
        "HR professional specializing in garment industry workforce management, labour law compliance, and employee relations.",
      phone: "+8801812345678",
      email: "karim.hasan@email.com",
      experience: [
        {
          id: "exp-1",
          title: "HR Manager",
          company: "Standard Group",
          location: "Gazipur",
          startDate: "2020-01",
          current: true,
          responsibilities: [
            "Manage 3000+ worker HR operations",
            "Ensure labour law compliance",
            "Lead recruitment for factory roles",
          ],
          achievements: ["Zero labour court cases in 3 years", "Reduced attrition by 25%"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "North South University",
          degree: "MBA",
          field: "Human Resource Management",
          startDate: "2014",
          endDate: "2016",
          current: false,
        },
      ],
      skills: [
        { id: "sk-1", name: "Labour Law", level: "expert", evidence: "candidate_provided" },
        { id: "sk-2", name: "Recruitment", level: "advanced", evidence: "cv_extracted" },
        { id: "sk-3", name: "Employee Relations", level: "expert", evidence: "assessment_derived" },
        { id: "sk-4", name: "HRIS", level: "intermediate", evidence: "candidate_provided" },
      ],
      preferences: {
        desiredRoles: ["HR Manager", "HR Business Partner"],
        salaryExpectation: { min: 70000, max: 100000, currency: "BDT", period: "monthly" },
        preferredLocations: [{ divisionId: "dhaka", districtId: "gazipur" }],
        workMode: ["on_site"],
        noticePeriodDays: 90,
      },
      visibility: "open",
      completeness: 85,
    },
    savedJobIds: ["job-003", "job-020"],
  },
  {
    id: "cand-003",
    userId: "user-candidate-3",
    name: "Nusrat Jahan",
    passport: {
      headline: "RMG Merchandiser | Export Specialist",
      summary:
        "Merchandiser with 4 years experience managing European and US buyer accounts in woven and knit garments.",
      phone: "+8801912345678",
      email: "nusrat.jahan@email.com",
      experience: [
        {
          id: "exp-1",
          title: "Merchandiser",
          company: "DBL Group",
          location: "Gazipur",
          startDate: "2022-01",
          current: true,
          responsibilities: [
            "Manage 5 buyer accounts",
            "Track order from sampling to shipment",
            "Costing and negotiation",
          ],
          achievements: ["100% on-time delivery for 2025", "Expanded account by 20%"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "BGMEA University of Fashion & Technology",
          degree: "B.Sc",
          field: "Apparel Manufacturing",
          startDate: "2016",
          endDate: "2020",
          current: false,
        },
      ],
      skills: [
        { id: "sk-1", name: "Buyer Communication", level: "advanced", evidence: "candidate_provided" },
        { id: "sk-2", name: "Costing", level: "advanced", evidence: "cv_extracted" },
        { id: "sk-3", name: "Production Tracking", level: "expert", evidence: "candidate_provided" },
      ],
      preferences: {
        desiredRoles: ["RMG Merchandiser", "Senior Merchandiser"],
        salaryExpectation: { min: 55000, max: 80000, currency: "BDT", period: "monthly" },
        preferredLocations: [{ divisionId: "dhaka", districtId: "gazipur" }],
        workMode: ["on_site"],
        noticePeriodDays: 30,
      },
      visibility: "actively_looking",
      completeness: 78,
    },
    savedJobIds: ["job-005", "job-006"],
  },
  {
    id: "cand-004",
    userId: "user-candidate-4",
    name: "Tanvir Ahmed",
    passport: {
      headline: "Full Stack Developer | React, Node.js, Go",
      summary:
        "Software engineer with 5 years building web applications and payment systems. Passionate about clean code and scalable architecture.",
      phone: "+8801612345678",
      email: "tanvir.ahmed@email.com",
      experience: [
        {
          id: "exp-1",
          title: "Senior Software Engineer",
          company: "SSL Wireless",
          location: "Dhaka",
          startDate: "2022-06",
          current: true,
          responsibilities: [
            "Build payment gateway integrations",
            "Design REST APIs",
            "Lead frontend architecture",
          ],
          achievements: ["Reduced API latency by 60%", "Mentored 3 junior developers"],
        },
        {
          id: "exp-2",
          title: "Software Engineer",
          company: "Brain Station 23",
          location: "Dhaka",
          startDate: "2019-07",
          endDate: "2022-05",
          current: false,
          responsibilities: ["Full stack development", "Client project delivery"],
          achievements: ["Delivered 8 client projects on time"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "BUET",
          degree: "B.Sc",
          field: "Computer Science",
          startDate: "2014",
          endDate: "2018",
          current: false,
        },
      ],
      skills: [
        { id: "sk-1", name: "React/Next.js", level: "expert", evidence: "candidate_provided" },
        { id: "sk-2", name: "Node.js", level: "advanced", evidence: "cv_extracted" },
        { id: "sk-3", name: "Go", level: "intermediate", evidence: "candidate_provided" },
        { id: "sk-4", name: "System Design", level: "advanced", evidence: "assessment_derived" },
        { id: "sk-5", name: "PostgreSQL", level: "advanced", evidence: "cv_extracted" },
      ],
      preferences: {
        desiredRoles: ["Software Engineer", "Full Stack Engineer", "DevOps Engineer"],
        salaryExpectation: { min: 100000, max: 150000, currency: "BDT", period: "monthly" },
        preferredLocations: [{ divisionId: "dhaka", districtId: "dhaka-metro" }],
        workMode: ["hybrid", "remote"],
        noticePeriodDays: 30,
      },
      visibility: "actively_looking",
      completeness: 95,
    },
    savedJobIds: ["job-009", "job-010", "job-011", "job-019"],
  },
  {
    id: "cand-005",
    userId: "user-candidate-5",
    name: "Farhana Yasmin",
    passport: {
      headline: "Sales Executive | FMCG | Territory Management",
      summary:
        "Dynamic sales professional with 3 years in FMCG sector covering modern trade and general trade channels.",
      phone: "+8801512345678",
      email: "farhana.yasmin@email.com",
      experience: [
        {
          id: "exp-1",
          title: "Sales Executive",
          company: "ACI Limited",
          location: "Dhaka",
          startDate: "2023-01",
          current: true,
          responsibilities: [
            "Achieve monthly sales targets",
            "Manage 150+ retail outlets",
            "Product merchandising",
          ],
          achievements: ["Top performer Q3 2025", "Expanded territory by 30 outlets"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Jahangirnagar University",
          degree: "BBA",
          field: "Marketing",
          startDate: "2017",
          endDate: "2021",
          current: false,
        },
      ],
      skills: [
        { id: "sk-1", name: "Field Sales", level: "advanced", evidence: "candidate_provided" },
        { id: "sk-2", name: "Retailer Relations", level: "advanced", evidence: "cv_extracted" },
        { id: "sk-3", name: "Merchandising", level: "intermediate", evidence: "candidate_provided" },
      ],
      preferences: {
        desiredRoles: ["Sales Executive", "Territory Sales Manager"],
        salaryExpectation: { min: 35000, max: 55000, currency: "BDT", period: "monthly" },
        preferredLocations: [
          { divisionId: "dhaka", districtId: "dhaka-metro" },
          { divisionId: "chittagong", districtId: "chittagong-metro" },
        ],
        workMode: ["on_site"],
        noticePeriodDays: 30,
      },
      visibility: "open",
      completeness: 70,
    },
    savedJobIds: ["job-007", "job-008"],
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getCandidateByUserId(userId: string): Candidate | undefined {
  return candidates.find((c) => c.userId === userId);
}
