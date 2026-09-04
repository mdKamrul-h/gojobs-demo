import { setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/candidate/auth/SignupForm";

type Props = { params: Promise<{ locale: string }> };

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container mx-auto px-4 py-12">
      <SignupForm />
    </div>
  );
}
