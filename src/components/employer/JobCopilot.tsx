"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { JobDraft } from "@/lib/mock/services/employer";

interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface JobCopilotProps {
  onApplySuggestion: (partial: Partial<JobDraft>) => void;
  className?: string;
}

const SCRIPTED_RESPONSES: Record<string, Partial<JobDraft>> = {
  "senior hr for garment factory": {
    title: "Senior HR Manager",
    occupation: "hr_manager",
    seniority: "senior",
    description:
      "Lead HR operations for a large garment factory including recruitment, labour compliance, and employee relations.",
    responsibilities: [
      "Manage factory-wide recruitment pipeline",
      "Ensure labour law and compliance standards",
      "Handle employee grievances and relations",
    ],
    hardRequirements: [
      { id: "hr-1", label: "MBA in HR or equivalent", type: "hard" },
      { id: "hr-2", label: "5+ years HR experience in RMG", type: "hard" },
      { id: "hr-3", label: "Labour law knowledge", type: "hard" },
    ],
    softRequirements: [
      { id: "sr-1", label: "Employee relations", type: "soft" },
      { id: "sr-2", label: "Conflict resolution", type: "soft" },
    ],
    location: { divisionId: "dhaka", districtId: "gazipur" },
    salary: { min: 70000, max: 100000, currency: "BDT", period: "monthly" },
    workMode: "on_site",
  },
  "backend engineer fintech": {
    title: "Backend Engineer",
    occupation: "software_engineer",
    seniority: "mid",
    description: "Build scalable payment processing services for a fintech platform.",
    responsibilities: ["Design APIs", "Write clean backend code", "Participate in code reviews"],
    hardRequirements: [
      { id: "hr-1", label: "3+ years backend development", type: "hard" },
      { id: "hr-2", label: "Java or Go experience", type: "hard" },
    ],
    softRequirements: [{ id: "sr-1", label: "Problem solving", type: "soft" }],
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "gulshan" },
    salary: { min: 90000, max: 140000, currency: "BDT", period: "monthly" },
    workMode: "hybrid",
  },
  "sales executive fmcg": {
    title: "Sales Executive",
    occupation: "sales_executive",
    seniority: "entry",
    description: "Drive FMCG sales in assigned territory covering modern and general trade.",
    responsibilities: ["Achieve sales targets", "Merchandise products", "Build retailer relationships"],
    hardRequirements: [
      { id: "hr-1", label: "BBA or equivalent", type: "hard" },
      { id: "hr-2", label: "Valid driving license", type: "hard" },
    ],
    softRequirements: [{ id: "sr-1", label: "Field sales experience", type: "soft" }],
    location: { divisionId: "dhaka", districtId: "dhaka-metro", neighborhoodId: "tejgaon" },
    salary: { min: 35000, max: 50000, currency: "BDT", period: "monthly" },
    workMode: "on_site",
  },
};

function findScriptedResponse(input: string): Partial<JobDraft> | null {
  const normalized = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(SCRIPTED_RESPONSES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  if (normalized.includes("hr") && (normalized.includes("garment") || normalized.includes("rmg"))) {
    return SCRIPTED_RESPONSES["senior hr for garment factory"];
  }
  if (normalized.includes("engineer") || normalized.includes("developer")) {
    return SCRIPTED_RESPONSES["backend engineer fintech"];
  }
  if (normalized.includes("sales")) {
    return SCRIPTED_RESPONSES["sales executive fmcg"];
  }
  return null;
}

export function JobCopilot({ onApplySuggestion, className }: JobCopilotProps) {
  const t = useTranslations("employer.jobCreation.copilot");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t("welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: CopilotMessage = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    await new Promise((r) => setTimeout(r, 600));

    const suggestion = findScriptedResponse(text);
    if (suggestion) {
      onApplySuggestion(suggestion);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: t("applied", { title: suggestion.title ?? "job" }),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: t("noMatch") },
      ]);
    }
    setThinking(false);
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3 min-h-0">
        <ScrollArea className="flex-1 min-h-[200px] max-h-[320px] rounded-md border p-3">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "text-sm rounded-lg px-3 py-2 max-w-[90%]",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {msg.content}
              </div>
            ))}
            {thinking && (
              <div className="text-sm text-muted-foreground animate-pulse">{t("thinking")}</div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("placeholder")}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend} disabled={thinking || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t("hint")}</p>
      </CardContent>
    </Card>
  );
}
