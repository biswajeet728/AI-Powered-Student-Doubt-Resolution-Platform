import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-sessions";
import { getSubjects } from "@/lib/actions/subject";
import AskDoubtPageView from "@/views/dashboard/_ask-doubt-page-view";

export default async function AskDoubtPage() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const subjects = await getSubjects();

  return <AskDoubtPageView subjects={subjects} />;
}
