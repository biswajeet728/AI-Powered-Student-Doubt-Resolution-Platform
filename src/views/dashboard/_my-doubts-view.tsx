"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { toast } from "sonner";
import { useMyDoubts, useDeleteDoubt } from "@/lib/hooks/use-doubts";

interface DoubtData {
  id: string;
  title: string;
  body: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: Date;
  subject: { name: string } | null;
  _count: { responses: number };
}

interface MyDoubtsViewProps {
  initialDoubts: DoubtData[];
  userName: string;
}

const statusConfig = {
  OPEN: { label: "Open", className: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: HiOutlineClock },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: HiOutlineSparkles },
  RESOLVED: { label: "Resolved", className: "bg-green-500/15 text-green-400 border-green-500/20", icon: HiOutlineCheckCircle },
};

const diffConfig = {
  EASY: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-amber-500/10 text-amber-400",
  HARD: "bg-red-500/10 text-red-400",
};

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MyDoubtsView({ initialDoubts, userName }: MyDoubtsViewProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "OPEN" | "UNDER_REVIEW" | "RESOLVED">("ALL");

  const { data: doubts = initialDoubts } = useMyDoubts(
    activeFilter === "ALL" ? undefined : activeFilter
  );

  const deleteMutation = useDeleteDoubt();

  const handleDelete = async (id: string) => {
    const result = await deleteMutation.mutateAsync(id);
    if (result.success) {
      toast.success("Doubt deleted");
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">My Doubts</h1>
          <p className="font-mono text-sm text-white/40 mt-1">
            {doubts.length} doubt{doubts.length !== 1 ? "s" : ""} posted
          </p>
        </div>
        <Link href="/dashboard/ask">
          <Button className="font-mono bg-amber-500 text-black hover:bg-amber-400 cursor-pointer">
            <HiOutlinePencilSquare className="mr-2 h-4 w-4" />
            Ask a Doubt
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-1 flex-wrap">
        {(["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
              activeFilter === f
                ? "bg-amber-500/20 text-amber-400"
                : "text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {f === "ALL" ? "All" : f.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Doubts list */}
      {doubts.length === 0 ? (
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HiOutlineSparkles className="mb-4 h-12 w-12 text-white/20" />
            <h3 className="font-mono text-lg font-semibold text-white/60">
              No doubts yet
            </h3>
            <p className="mb-4 font-mono text-sm text-white/40">
              Post your first doubt and get an AI answer!
            </p>
            <Link href="/dashboard/ask">
              <Button className="font-mono bg-amber-500 text-black hover:bg-amber-400 cursor-pointer">
                <HiOutlineSparkles className="mr-2 h-4 w-4" />
                Ask a Doubt
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {doubts.map((doubt) => {
            const status = statusConfig[doubt.status];
            const diff = diffConfig[doubt.difficulty];
            const StatusIcon = status.icon;

            return (
              <Card
                key={doubt.id}
                className="group border-white/10 bg-[#2a2826]/80 backdrop-blur-sm transition-all hover:border-amber-500/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <Link href={`/doubt/${doubt.id}`} className="block">
                          <h3 className="font-mono text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                            {doubt.title}
                          </h3>
                        </Link>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${status.className}`}>
                          <StatusIcon className="inline h-2.5 w-2.5 mr-0.5 -mt-0.5" />
                          {status.label}
                        </span>
                      </div>

                      <p className="font-mono text-xs text-white/40 line-clamp-2 mb-3">
                        {doubt.body}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                            {doubt.subject?.name || "General"}
                          </span>
                          <span className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${diff}`}>
                            {doubt.difficulty.charAt(0) + doubt.difficulty.slice(1).toLowerCase()}
                          </span>
                          <span className="font-mono text-[10px] text-white/20">
                            {formatTimeAgo(doubt.createdAt)}
                          </span>
                          {doubt._count.responses > 0 && (
                            <span className="font-mono text-[10px] text-purple-400">
                              {doubt._count.responses} response{doubt._count.responses !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link href={`/doubt/${doubt.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-mono text-xs text-white/40 hover:text-white cursor-pointer"
                            >
                              View
                              <HiOutlineChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                          <button
                            onClick={() => handleDelete(doubt.id)}
                            className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <HiOutlineTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
