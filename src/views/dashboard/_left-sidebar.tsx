import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBookOpen,
} from "react-icons/hi2";
import StatCard from "./_stat-card";

interface LeftSidebarProps {
  user: { name: string; role: string };
  stats: {
    total: number;
    open: number;
    resolved: number;
    aiAnswers: number;
  };
}

export default function LeftSidebar({ user, stats }: LeftSidebarProps) {
  const isStudent = user.role === "STUDENT";

  return (
    <aside className="sticky top-18 flex flex-col gap-3">
      {/* Welcome */}
      <div className="mb-1">
        <p className="font-mono text-xs text-white/40">
          {isStudent ? "Student" : "Teacher"}
        </p>
        <h1 className="font-mono text-base font-bold text-white leading-tight">
          {user.name.split(" ")[0]}
        </h1>
      </div>

      <StatCard
        icon={<HiOutlineSparkles className="h-5 w-5 text-amber-400" />}
        iconBg="bg-amber-500/15"
        label="Total Doubts"
        value={String(stats.total)}
      />
      <StatCard
        icon={<HiOutlineClock className="h-5 w-5 text-blue-400" />}
        iconBg="bg-blue-500/15"
        label="Open"
        value={String(stats.open)}
      />
      <StatCard
        icon={<HiOutlineCheckCircle className="h-5 w-5 text-green-400" />}
        iconBg="bg-green-500/15"
        label="Resolved"
        value={String(stats.resolved)}
      />
      <StatCard
        icon={
          <HiOutlineChatBubbleLeftRight className="h-5 w-5 text-purple-400" />
        }
        iconBg="bg-purple-500/15"
        label="AI Answers"
        value={String(stats.aiAnswers)}
      />

      <div className="my-1 h-px bg-white/10" />

      <p className="font-mono text-xs font-semibold text-white/40 uppercase tracking-wider">
        Quick Actions
      </p>

      {isStudent ? (
        <>
          <Link href="/dashboard/ask">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start font-mono text-xs border-white/10 bg-white/5 text-white hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/30 py-4 cursor-pointer"
            >
              <HiOutlineSparkles className="mr-2 h-3.5 w-3.5 text-amber-400" />
              Ask a Doubt
            </Button>
          </Link>
          <Link href="/my-doubts">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start font-mono text-xs border-white/10 bg-white/5 text-white hover:bg-white/10 py-4 cursor-pointer"
            >
              <HiOutlineClock className="mr-2 h-3.5 w-3.5 text-blue-400" />
              My Doubts
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link href="/teacher/review">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start font-mono text-xs border-white/10 bg-white/5 text-white hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/30"
            >
              <HiOutlineChatBubbleLeftRight className="mr-2 h-3.5 w-3.5 text-purple-400" />
              Review Queue
            </Button>
          </Link>
          <Link href="/my-doubts">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start font-mono text-xs border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <HiOutlineBookOpen className="mr-2 h-3.5 w-3.5 text-blue-400" />
              All Doubts
            </Button>
          </Link>
        </>
      )}
    </aside>
  );
}
