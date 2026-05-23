import { getServerSession } from "@/lib/get-sessions";
import { getMyDoubts } from "@/lib/actions/doubt";
import MyDoubtsView from "@/views/dashboard/_my-doubts-view";

export default async function MyDoubtsPage() {
  const session = await getServerSession();
  const initialDoubts = await getMyDoubts();

  return <MyDoubtsView initialDoubts={initialDoubts} userName={session!.user!.name} />;
}
