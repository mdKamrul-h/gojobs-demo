# GoJobs Demo Guide for Founders

This prototype runs entirely on **mock data** — no backend, no real authentication, no credential verification. Use it to walk investors and partners through the product vision across all four roles.

## Quick start

```bash
npm install   # first time only
npm run dev
```

Open **http://localhost:3000/en** (English) or **http://localhost:3000/bn** (Bengali).

Production build check: `npm run build`

---

## Role switcher (fastest way to demo)

In the header, click the **Demo** button (user icon + role label):

| Role | Who you become | Best for showing |
|------|----------------|------------------|
| **Public** | Logged-out visitor | Job search, guest apply, company pages |
| **Candidate** | Rahima Akter (default) | Career Passport, applications, assessments |
| **Recruiter** | Sabrina Rahman @ bKash | ATS, talent search, job posting |
| **Admin** | Admin User | Moderation queue, trust verification |

When logged in, the switcher shows **name · role** (e.g. `Rahima Akter · Candidate`).

**Logout:** Use **Log out** in the header or inside the role switcher dropdown.

---

## Login page (`/login`)

Alternative to the role switcher — one-click demo accounts grouped by role:

- **Candidates:** Rahima Akter, Karim Hasan, Nusrat Jahan
- **Recruiters:** Sabrina Rahman (bKash), Mohammad Ali (Ha-Meem)
- **Admin:** Admin User

Any email/password also works (creates a guest candidate).

---

## Walkthrough by role

### 1. Public visitor

Start as **Public** or open the homepage directly.

1. **Home** `/` — hero search, featured jobs, category/location browse
2. **Jobs** `/jobs` — filters (location, salary, work mode, occupation)
3. **Job detail** `/jobs/software-engineer-bkash` — requirements, evidence-based match panel (when logged in as candidate), guest apply
4. **Guest apply** `/jobs/software-engineer-bkash/apply` — multi-step form, consent note (no verification claims)
5. **Companies** `/companies` — employer directory
6. **Pricing** `/pricing` — job packages and subscriptions (BDT, demo only)
7. **Campus** `/campus` — university hiring hub
8. **Frontline** `/frontline` — phone-first onboarding (Bengali UX)

**Talking points:** Open marketplace, trust indicators, scam/report flow on flagged listings, no “verified candidate” language.

### 2. Candidate

Switch to **Candidate** or log in as Rahima Akter.

1. **Dashboard** `/candidate` — stats, recommended jobs, quick actions
2. **Career Passport** `/candidate/passport` — evidence-tagged profile (identity, experience, skills)
3. **Applications** `/candidate/applications` — pipeline stages
4. **Application detail** `/candidate/applications/app-001` — dimensional match, General Assessment CTA, timeline
5. **Role assessment** `/candidate/assessments/ra-accountant-001` — mixed MCQ + short answer
6. **Interviews** `/candidate/interviews` — AI + human sessions
7. **AI interview** `/candidate/interviews/int-ai-001` — device check → mock transcript
8. **Saved jobs** `/candidate/saved`
9. **Onboarding** `/candidate/onboarding` — CV upload wizard
10. **Career Agent** `/candidate/agent` — fit/gap prompts

**Talking points:** 50% overlap rule for General Assessment eligibility, evidence badges (`candidate_provided`, `cv_extracted`, `assessment_derived`), dimensional match — never a single opaque score.

### 3. Recruiter (Employer)

Switch to **Recruiter** or log in as Sabrina Rahman.

1. **Dashboard** `/employer` — open jobs, hiring funnel (≥50% overlap counts)
2. **Onboarding** `/employer/onboarding` — company verification flow (simulate approval)
3. **Post job** `/employer/jobs/new` — form + Job Copilot (“senior HR for garment factory”)
4. **Applicants (Kanban)** `/employer/jobs/job-009/applicants` — pipeline by stage
5. **Candidate review** `/employer/jobs/job-003/applicants/app-003` — passport summary, dimensional match, stage moves, notes
6. **Talent search** `/employer/talent-search` — competency graph, salary intelligence, NL search demo
7. **Assessments** `/employer/assessments` — template toggles
8. **Interviews** `/employer/interviews` — AI review + human scheduling
9. **Hiring Agent** `/employer/agent` — shortlist/pipeline prompts
10. **Enterprise** `/employer/enterprise` — SSO, API, webhooks, team (UI shells)
11. **Billing** `/employer/billing` — plan, usage, bKash demo, invoices

**Talking points:** Recruiter sees overlap thresholds (50%/70%), evidence sources on every dimension, Employer Checks disclaimer (company-run, not GoJobs verification).

### 4. Admin

Switch to **Admin**.

1. **Admin dashboard** `/admin` — platform stats, job moderation tab, trust verification queue

**Talking points:** Flagged jobs (salary mismatch, unverified employer), pending company trust reviews.

---

## Key URLs cheat sheet

| Area | URL |
|------|-----|
| Home | `/en` |
| Job search | `/en/jobs` |
| Sample job | `/en/jobs/software-engineer-bkash` |
| Candidate dashboard | `/en/candidate` |
| Application pipeline | `/en/candidate/applications/app-001` |
| AI interview | `/en/candidate/interviews/int-ai-001` |
| Employer ATS | `/en/employer/jobs/job-009/applicants` |
| Candidate review | `/en/employer/jobs/job-003/applicants/app-003` |
| Talent search | `/en/employer/talent-search` |
| Admin | `/en/admin` |

Replace `en` with `bn` for Bengali.

---

## What the mock data demonstrates

### 50% General Assessment rule
Candidates need **≥50% relevant dimensional overlap** before a General Assessment is offered. Below that, the UI explains limited fit — no assessment gate.

### Evidence labels
Every competency and match dimension carries an evidence source:
- Candidate provided
- CV extracted
- Assessment derived
- Interview derived
- Recruiter entered

### No verification claims
Copy consistently states GoJobs **does not verify** candidate credentials. Employer Checks are performed by the hiring company. Trust badges refer to **employer** verification on the platform, not individual candidates.

### Dimensional match (not one score)
Recruiters and candidates see **per-dimension** strong/moderate/limited overlap with evidence — avoiding a single misleading percentage as the only signal (overlap % is contextual, not a hire/no-hire verdict).

### Trust & safety
- Pending-trust employers show caution banners
- Job report flow for suspicious listings
- Admin moderation queue for flagged posts

---

## Tips for live demos

1. **Start Public** → search jobs → show guest apply consent language
2. **Switch to Candidate** → open `app-001` → show match dimensions + assessment
3. **Switch to Recruiter** → open ATS for `job-009` → drill into `app-003` review workspace
4. **Switch to Admin** → show moderation + trust queue
5. Toggle **bn/en** with the language switcher to show localization

Role state persists in `localStorage` (`gojobs_demo_auth`) until logout or switching to Public.

---

## Limitations (by design)

- No real file uploads, payments, or email
- Agent chat returns mock responses
- Enterprise SSO/API are UI placeholders
- Data resets only on page refresh for some in-memory signup users

For questions about the prototype architecture, see the codebase under `src/lib/mock/`.
