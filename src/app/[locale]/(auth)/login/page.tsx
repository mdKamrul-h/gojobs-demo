import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/candidate/auth/LoginForm";

type Props = { params: Promise<{ locale: string }> };

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container mx-auto px-4 py-12">
      <LoginForm />
    </div>
  );
}
