import { setRequestLocale } from "next-intl/server";
import { PassportEditor } from "@/components/candidate/passport/PassportEditor";

type Props = { params: Promise<{ locale: string }> };

export default async function PassportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PassportEditor />;
}
