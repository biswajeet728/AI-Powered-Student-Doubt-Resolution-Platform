import { getServerSession } from "@/lib/get-sessions";
import { redirect } from "next/navigation";
import { getDashboardStats, getRecentDoubts } from "@/lib/actions/doubt";
import DashboardView from "@/views/dashboard/_dashboard-view";

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  // SSR fetch for initial data
  const [stats, recentDoubts] = await Promise.all([
    getDashboardStats(),
    getRecentDoubts(10),
  ]);

  return (
    <DashboardView
      user={{ name: user.name, role: user.role }}
      initialStats={stats ?? { total: 0, open: 0, resolved: 0, aiAnswers: 0 }}
      initialDoubts={recentDoubts}
    />
  );
}
