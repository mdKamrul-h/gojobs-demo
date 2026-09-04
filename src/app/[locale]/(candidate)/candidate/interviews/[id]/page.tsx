import { notFound } from "next/navigation";
import { AiInterviewFlow } from "@/components/interviews/AiInterviewFlow";
import { getInterviewSession } from "@/lib/mock/fixtures/interviews";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const session = getInterviewSession(id);
  if (!session || session.type !== "ai") notFound();
  return <AiInterviewFlow session={session} />;
}
