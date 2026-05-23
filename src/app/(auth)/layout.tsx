import { getServerSession } from "@/lib/get-sessions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Doubt-Flow to ask doubts and get AI-powered answers.",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return children;
}
