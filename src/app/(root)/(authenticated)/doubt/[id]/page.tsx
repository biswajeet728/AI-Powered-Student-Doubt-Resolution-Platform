import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/get-sessions";
import { getDoubtById } from "@/lib/actions/doubt";
import { getSubjects } from "@/lib/actions/subject";
import DoubtDetailView from "@/views/dashboard/_doubt-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoubtDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const [result, subjects] = await Promise.all([
    getDoubtById(id),
    getSubjects(),
  ]);

  if (!result.success) {
    notFound();
  }

  return (
    <DoubtDetailView
      doubtId={id}
      initialDoubt={result.doubt!}
      currentUserId={result.currentUserId}
      subjects={subjects}
    />
  );
}
