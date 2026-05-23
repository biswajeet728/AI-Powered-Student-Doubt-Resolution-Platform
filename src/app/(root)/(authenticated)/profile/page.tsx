import { getServerSession } from "@/lib/get-sessions";
import { getDashboardStats } from "@/lib/actions/doubt";
import ProfileView from "@/views/profile/_profile-view";

export default async function ProfilePage() {
  const session = await getServerSession();
  const stats = await getDashboardStats();

  return (
    <ProfileView
      user={{
        id: session!.user!.id,
        name: session!.user!.name,
        email: session!.user!.email,
        role: session!.user!.role,
        image: session!.user!.image ?? null,
      }}
      stats={{
        total: stats?.total ?? 0,
        open: stats?.open ?? 0,
        resolved: stats?.resolved ?? 0,
      }}
    />
  );
}
