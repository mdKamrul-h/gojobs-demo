import { getTranslations } from "next-intl/server";

export async function HowGoJobsWorks() {
  const t = await getTranslations("home");

  const candidateSteps = [
    { title: t("howCandidateStep1Title"), desc: t("howCandidateStep1Desc") },
    { title: t("howCandidateStep2Title"), desc: t("howCandidateStep2Desc") },
    { title: t("howCandidateStep3Title"), desc: t("howCandidateStep3Desc") },
  ];
  const employerSteps = [
    { title: t("howEmployerStep1Title"), desc: t("howEmployerStep1Desc") },
    { title: t("howEmployerStep2Title"), desc: t("howEmployerStep2Desc") },
    { title: t("howEmployerStep3Title"), desc: t("howEmployerStep3Desc") },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-2xl font-bold">{t("howItWorks")}</h2>
      <div className="grid gap-10 lg:grid-cols-2">
        <StepRow title={t("howCandidateTitle")} steps={candidateSteps} />
        <StepRow title={t("howEmployerTitle")} steps={employerSteps} />
      </div>
    </section>
  );
}

function StepRow({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; desc: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {i + 1}
            </span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
