"use client";

import { useState } from "react";
import { useRecentDoubts, useDashboardStats } from "@/lib/hooks/use-doubts";
import LeftSidebar from "./_left-sidebar";
import RightSidebar from "./_right-sidebar";
import DoubtFeed from "./_doubt-feed";

interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  aiAnswers: number;
  pendingReview?: number;
}

interface RecentDoubt {
  id: string;
  title: string;
  body: string;
  subject: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: Date;
  aiResponseId: string | null;
  aiAnswer: string | null;
  aiApproved: boolean;
  studentName: string;
  responseCount: number;
}

interface DashboardViewProps {
  user: { name: string; role: string };
  initialStats: DashboardStats;
  initialDoubts: RecentDoubt[];
}

export default function DashboardView({
  user,
  initialStats,
  initialDoubts,
}: DashboardViewProps) {
  const isStudent = user.role === "STUDENT";
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // React Query with SSR initial data
  const { data: doubts = initialDoubts } = useRecentDoubts(10);
  const { data: statsData } = useDashboardStats();
  const stats = statsData ?? initialStats;

  // Client-side subject filter
  const filteredDoubts = selectedSubject
    ? doubts.filter((d) => d.subject === selectedSubject)
    : doubts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid grid-cols-[250px_1fr_250px] gap-4">
        <div>
          <LeftSidebar user={user} stats={stats} />
        </div>
        <main>
          <DoubtFeed
            isStudent={isStudent}
            doubts={filteredDoubts}
            stats={stats}
            selectedSubject={selectedSubject}
            onClearSubject={() => setSelectedSubject(null)}
          />
        </main>
        <div>
          <RightSidebar
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
          />
        </div>
      </div>

      {/* Tablet: 2 columns (feed + right sidebar) */}
      <div className="hidden md:grid lg:hidden grid-cols-[1fr_250px] gap-4">
        <main>
          <DoubtFeed
            isStudent={isStudent}
            showStats
            doubts={filteredDoubts}
            stats={stats}
            selectedSubject={selectedSubject}
            onClearSubject={() => setSelectedSubject(null)}
          />
        </main>
        <div className="self-start sticky top-18">
          <RightSidebar
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
          />
        </div>
      </div>

      {/* Mobile: single column */}
      <div className="md:hidden">
        <main>
          <DoubtFeed
            isStudent={isStudent}
            showStats
            showFilters
            doubts={filteredDoubts}
            stats={stats}
          />
        </main>
      </div>
    </div>
  );
}
