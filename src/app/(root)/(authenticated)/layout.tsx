import { getServerSession } from "@/lib/get-sessions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSubjects } from "@/lib/actions/subject";
import HeaderDashboard from "@/views/dashboard/_header-dashboard";
import AskDoubtModal from "@/views/dashboard/_ask-doubt-modal";
import AuthenticatedWrapper from "./_authenticated-wrapper";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  const subjects = await getSubjects();

  return (
    <AuthenticatedWrapper
      initialUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image ?? null,
      }}
      header={<HeaderDashboard />}
      modal={user.role === "STUDENT" ? <AskDoubtModal subjects={subjects} /> : null}
    >
      {children}
    </AuthenticatedWrapper>
  );
}
