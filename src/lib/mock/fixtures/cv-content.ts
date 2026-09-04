import type { Candidate } from "@/lib/types";

export interface CvSection {
  title: string;
  items: string[];
}

export interface CvContent {
  fileName: string;
  summary: string;
  contact: { email: string; phone: string; location?: string };
  sections: CvSection[];
}

export const guestCvByEmail: Record<string, CvContent> = {
  "sultana.begum@email.com": {
    fileName: "sultana_begum_cv.pdf",
    summary:
      "Customer service professional with 3 years handling mobile financial services inquiries at partner outlets. Known for calm complaint resolution and bilingual support.",
    contact: {
      email: "sultana.begum@email.com",
      phone: "+8801613004455",
      location: "Mirpur, Dhaka",
    },
    sections: [
      {
        title: "Experience",
        items: [
          "Customer Support Associate — bKash Partner Outlet, Mirpur (2023–Present): Resolved 40+ daily merchant and customer queries, documented escalations, maintained SLA targets.",
          "Front Desk Executive — Local MFS Agent, Dhaka (2021–2023): Handled cash-in/cash-out support and basic KYC guidance.",
        ],
      },
      {
        title: "Education",
        items: ["HSC — Mirpur Girls College, 2020", "Diploma in Office Management — Part-time, 2022"],
      },
      {
        title: "Skills",
        items: [
          "Bangla & English customer communication",
          "MFS product knowledge (bKash, Nagad basics)",
          "Complaint handling & escalation",
          "MS Word, basic Excel",
        ],
      },
    ],
  },
  "rubel.ahmed@email.com": {
    fileName: "rubel_ahmed_cv.pdf",
    summary:
      "Senior customer service representative with 6 years in MFS call centre operations. Team lead experience on evening shifts; strong product knowledge and coaching skills.",
    contact: {
      email: "rubel.ahmed@email.com",
      phone: "+8801618009900",
      location: "Uttara, Dhaka",
    },
    sections: [
      {
        title: "Experience",
        items: [
          "Team Lead — Rocket (Dutch-Bangla) Call Centre (2022–Present): Supervised 12 agents, coached on empathy scripts, maintained 92% CSAT.",
          "Customer Service Representative — bKash Helpline (2019–2022): Tier-1 & Tier-2 support for wallet, merchant, and remittance issues.",
        ],
      },
      {
        title: "Education",
        items: ["BBA (Marketing) — Northern University, 2018"],
      },
      {
        title: "Skills",
        items: [
          "MFS product knowledge (bKash, Rocket, Nagad)",
          "Team leadership & shift coordination",
          "Conflict de-escalation",
          "CRM tools (Zendesk, internal ticketing)",
        ],
      },
    ],
  },
};

export function getCvFromCandidate(candidate: Candidate): CvContent {
  const { passport } = candidate;
  return {
    fileName: `${candidate.name.toLowerCase().replace(/\s+/g, "_")}_passport.pdf`,
    summary: passport.summary,
    contact: {
      email: passport.email,
      phone: passport.phone,
      location: passport.preferences.preferredLocations[0]?.districtId?.replace(/-/g, " "),
    },
    sections: [
      {
        title: "Experience",
        items: passport.experience.map(
          (exp) =>
            `${exp.title} — ${exp.company}${exp.location ? `, ${exp.location}` : ""} (${exp.startDate}${exp.current ? "–Present" : exp.endDate ? `–${exp.endDate}` : ""}): ${exp.responsibilities.slice(0, 2).join("; ")}`
        ),
      },
      {
        title: "Education",
        items: passport.education.map(
          (edu) => `${edu.degree} in ${edu.field} — ${edu.institution}, ${edu.endDate ?? edu.startDate}`
        ),
      },
      {
        title: "Skills",
        items: passport.skills.map((s) => `${s.name} (${s.level.replace("_", " ")})`),
      },
    ],
  };
}

export function getGuestCvByEmail(email: string): CvContent | undefined {
  return guestCvByEmail[email];
}
