import { getServerSession } from "@/lib/get-sessions";
import { redirect } from "next/navigation";
import { getSubjects } from "@/lib/actions/subject";
import AskDoubtPageView from "@/views/dashboard/_ask-doubt-page-view";

export default async function AskDoubtPage() {
  // Layout already redirects unauthenticated users, so session is guaranteed here
  const session = await getServerSession();
  if (session?.user?.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const subjects = await getSubjects();

  return <AskDoubtPageView subjects={subjects} />;
}
