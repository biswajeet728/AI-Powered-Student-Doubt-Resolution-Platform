import { getServerSession } from "@/lib/get-sessions";
import { getDashboardStats, getRecentDoubts } from "@/lib/actions/doubt";
import DashboardView from "@/views/dashboard/_dashboard-view";

export default async function DashboardPage() {
  // Layout already ensures auth — session is cached via React cache()
  const session = await getServerSession();
  const user = session!.user!;

  const [stats, recentDoubts] = await Promise.all([
    getDashboardStats(),
    getRecentDoubts(10),
  ]);

  return (
    <DashboardView
      user={{ name: user.name, role: user.role }}
      initialStats={stats ?? { total: 0, open: 0, resolved: 0, aiAnswers: 0, pendingReview: 0 }}
      initialDoubts={recentDoubts}
    />
  );
}
