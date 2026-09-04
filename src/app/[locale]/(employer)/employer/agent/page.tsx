"use client";

import { useTranslations } from "next-intl";
import { AgentChat } from "@/components/agents/AgentChat";
import { EmployerNav } from "@/components/employer/EmployerNav";
import { PageContainer } from "@/components/shared/PageContainer";
import { hiringAgentScript, hiringAgentActivities } from "@/lib/mock/fixtures/agents";

export default function EmployerAgentPage() {
  const t = useTranslations("agents.hiring");

  return (
    <PageContainer>
      <EmployerNav />
      <AgentChat
        title={t("title")}
        subtitle={t("subtitle")}
        initialMessages={hiringAgentScript.default}
        scriptedResponses={hiringAgentScript}
        activities={hiringAgentActivities}
        quickPrompts={[
          { key: "shortlist", message: t("prompts.shortlist") },
          { key: "default", message: t("prompts.pipeline") },
        ]}
      />
    </PageContainer>
  );
}
