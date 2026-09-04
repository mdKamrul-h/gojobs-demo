export type AgentActionStatus = "suggested" | "approved" | "dismissed" | "completed";

export interface AgentAction {
  id: string;
  title: string;
  description: string;
  status: AgentActionStatus;
  createdAt: string;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: AgentAction[];
}

export interface AgentActivity {
  id: string;
  type: string;
  summary: string;
  timestamp: string;
}
