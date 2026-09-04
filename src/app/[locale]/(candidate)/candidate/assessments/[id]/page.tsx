import { notFound } from "next/navigation";
import { RoleAssessmentFlow } from "@/components/assessments/RoleAssessmentFlow";
import { getRoleAssessment } from "@/lib/mock/fixtures/interviews";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const assessment = getRoleAssessment(id);
  if (!assessment) notFound();
  return <RoleAssessmentFlow assessment={assessment} />;
}
