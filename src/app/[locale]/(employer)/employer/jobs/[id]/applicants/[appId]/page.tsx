import { setRequestLocale } from "next-intl/server";
import { CandidateReviewWorkspace } from "@/components/ats/CandidateReviewWorkspace";

type Props = { params: Promise<{ locale: string; id: string; appId: string }> };

export default async function CandidateReviewPage({ params }: Props) {
  const { locale, id, appId } = await params;
  setRequestLocale(locale);
  return <CandidateReviewWorkspace jobId={id} applicationId={appId} />;
}
