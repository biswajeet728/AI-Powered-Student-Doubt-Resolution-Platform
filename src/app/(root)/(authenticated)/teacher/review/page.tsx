import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-sessions";
import { getDoubtsForReview } from "@/lib/actions/response";
import { getTeacherStats } from "@/lib/actions/response";
import ReviewView from "@/views/teacher/_review-view";

export default async function TeacherReviewPage() {
  const session = await getServerSession();
  if (session?.user?.role !== "TEACHER") {
    redirect("/dashboard");
  }

  const [doubts, stats] = await Promise.all([
    getDoubtsForReview(),
    getTeacherStats(),
  ]);

  return (
    <ReviewView
      initialDoubts={doubts}
      initialStats={stats ?? { pending: 0, reviewed: 0, overridden: 0, totalAI: 0, approvedAI: 0 }}
    />
  );
}
