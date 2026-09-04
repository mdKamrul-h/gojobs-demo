"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentActivityPanel } from "./AgentActivityPanel";
import type { AgentAction, AgentMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AgentChatProps {
  title: string;
  subtitle: string;
  initialMessages: AgentMessage[];
  scriptedResponses: Record<string, AgentMessage[]>;
  activities: { id: string; type: string; summary: string; timestamp: string }[];
  quickPrompts: { key: string; message: string }[];
}

export function AgentChat({
  title,
  subtitle,
  initialMessages,
  scriptedResponses,
  activities,
  quickPrompts,
}: AgentChatProps) {
  const t = useTranslations("agents");
  const [messages, setMessages] = useState<AgentMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [actions, setActions] = useState<AgentAction[]>([]);

  function sendMessage(text: string, scriptKey?: string) {
    const userMsg: AgentMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const responses = scriptKey ? scriptedResponses[scriptKey] : scriptedResponses.default;
      const response = responses?.[responses.length - 1];
      if (response) {
        setMessages((prev) => [...prev, { ...response, id: `a-${Date.now()}` }]);
        if (response.actions) {
          setActions((prev) => [...prev, ...response.actions!]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: t("fallbackResponse"),
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }, 600);
  }

  function handleAction(actionId: string, status: "approved" | "dismissed") {
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status } : a))
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Bot className="h-6 w-6 text-primary" />
            {title}
          </h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>

        <Card className="min-h-[400px] flex flex-col">
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4 pt-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.content}
              </div>
            ))}
          </CardContent>
          <div className="border-t p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <Button
                  key={p.key}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(p.message, p.key)}
                >
                  {p.message}
                </Button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage(input.trim());
                  setInput("");
                }
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("inputPlaceholder")}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        {actions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("actionCards")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map((action) => (
                <div key={action.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <Badge variant={action.status === "approved" ? "default" : "outline"}>
                      {t(`actionStatus.${action.status}`)}
                    </Badge>
                  </div>
                  {action.status === "suggested" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAction(action.id, "approved")}>
                        {t("approve")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAction(action.id, "dismissed")}>
                        {t("dismiss")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <AgentActivityPanel activities={activities} />
    </div>
  );
}
