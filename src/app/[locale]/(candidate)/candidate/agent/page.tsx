"use client";

import { useTranslations } from "next-intl";
import { AgentChat } from "@/components/agents/AgentChat";
import { CandidateNav } from "@/components/candidate/CandidateNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { careerAgentScript, careerAgentActivities } from "@/lib/mock/fixtures/agents";

export default function CandidateAgentPage() {
  const t = useTranslations("agents.career");

  return (
    <PageContainer>
      <CandidateNav />
      <AgentChat
        title={t("title")}
        subtitle={t("subtitle")}
        initialMessages={careerAgentScript.default}
        scriptedResponses={careerAgentScript}
        activities={careerAgentActivities}
        quickPrompts={[
          { key: "fit", message: t("prompts.fit") },
          { key: "default", message: t("prompts.gaps") },
        ]}
      />
    </PageContainer>
  );
}
