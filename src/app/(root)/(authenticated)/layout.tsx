import { getServerSession } from "@/lib/get-sessions";
import { redirect } from "next/navigation";
import { getSubjects } from "@/lib/actions/subject";
import HeaderDashboard from "@/views/dashboard/_header-dashboard";
import AskDoubtModal from "@/views/dashboard/_ask-doubt-modal";

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
    <>
      <HeaderDashboard user={{ name: user.name, role: user.role }} />
      <main className="min-h-screen">
        {children}
      </main>
      {user.role === "STUDENT" && (
        <AskDoubtModal subjects={subjects} />
      )}
    </>
  );
}
