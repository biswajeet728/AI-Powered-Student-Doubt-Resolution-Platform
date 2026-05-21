"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDoubtsForReview, useApproveResponse, useDisapproveResponse } from "@/lib/hooks/use-responses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/markdown-renderer";
import TeacherResponseForm from "./_teacher-response-form";
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineAcademicCap,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

interface ReviewDoubt {
  id: string;
  title: string;
  body: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  subject: string;
  createdAt: Date;
  studentName: string;
  responseCount: number;
  responses: {
    id: string;
    content: string;
    source: "AI" | "TEACHER";
    approved: boolean;
    createdAt: Date;
    userName: string;
  }[];
}

interface TeacherStats {
  pending: number;
  reviewed: number;
  overridden: number;
  totalAI: number;
  approvedAI: number;
}

interface ReviewViewProps {
  initialDoubts: ReviewDoubt[];
  initialStats: TeacherStats;
}

const diffConfig = {
  EASY: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-amber-500/10 text-amber-400",
  HARD: "bg-red-500/10 text-red-400",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ReviewView({ initialDoubts, initialStats }: ReviewViewProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "OPEN" | "UNDER_REVIEW">("ALL");

  const { data: doubts = initialDoubts } = useDoubtsForReview(
    activeFilter === "ALL" ? undefined : activeFilter
  );

  const approveMutation = useApproveResponse();
  const disapproveMutation = useDisapproveResponse();

  const handleApprove = async (responseId: string) => {
    const result = await approveMutation.mutateAsync(responseId);
    if (result.success) {
      toast.success("Response approved!");
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleDisapprove = async (responseId: string) => {
    const result = await disapproveMutation.mutateAsync(responseId);
    if (result.success) {
      toast.success("Response disapproved");
    } else {
      toast.error(result.error || "Failed to disapprove");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-mono text-2xl font-bold text-white">Review Queue</h1>
        <p className="font-mono text-sm text-white/40 mt-1">
          Review AI answers, approve correct ones, or override with your own.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="font-mono text-2xl font-bold text-amber-400">{initialStats.pending}</p>
            <p className="font-mono text-xs text-white/40">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="font-mono text-2xl font-bold text-green-400">{initialStats.approvedAI}</p>
            <p className="font-mono text-xs text-white/40">AI Approved</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="font-mono text-2xl font-bold text-blue-400">{initialStats.totalAI}</p>
            <p className="font-mono text-xs text-white/40">Total AI Answers</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="font-mono text-2xl font-bold text-purple-400">{initialStats.reviewed}</p>
            <p className="font-mono text-xs text-white/40">Teacher Responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-1">
        {(["ALL", "OPEN", "UNDER_REVIEW"] as const).map((f) => (
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
            <HiOutlineCheckCircle className="mb-4 h-12 w-12 text-green-400/30" />
            <h3 className="font-mono text-lg font-semibold text-white/60">All caught up!</h3>
            <p className="font-mono text-sm text-white/40">
              No doubts need your review right now.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {doubts.map((doubt) => (
            <ReviewDoubtCard
              key={doubt.id}
              doubt={doubt}
              onApprove={handleApprove}
              onDisapprove={handleDisapprove}
              approveLoading={approveMutation.isPending}
              disapproveLoading={disapproveMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Individual Review Card ────────────────────────────────────────────
interface ReviewDoubtCardProps {
  doubt: ReviewDoubt;
  onApprove: (responseId: string) => void;
  onDisapprove: (responseId: string) => void;
  approveLoading: boolean;
  disapproveLoading: boolean;
}

function ReviewDoubtCard({
  doubt,
  onApprove,
  onDisapprove,
  approveLoading,
  disapproveLoading,
}: ReviewDoubtCardProps) {
  const diff = diffConfig[doubt.difficulty];
  const hasAIResponse = doubt.responses.some((r) => r.source === "AI");

  return (
    <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
      <CardContent className="p-5 space-y-4">
        {/* Doubt Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                {doubt.subject}
              </span>
              <span className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${diff}`}>
                {doubt.difficulty.charAt(0) + doubt.difficulty.slice(1).toLowerCase()}
              </span>
              <span className="font-mono text-[10px] text-white/20">
                {formatDate(doubt.createdAt)}
              </span>
            </div>
            <Link
              href={`/doubt/${doubt.id}`}
              className="font-mono text-sm font-semibold text-white hover:text-amber-300 transition-colors"
            >
              {doubt.title}
            </Link>
            <div className="font-mono text-xs text-white/40 mt-1 line-clamp-2">
              <MarkdownRenderer content={doubt.body} />
            </div>
            <p className="font-mono text-xs text-white/30 mt-1">
              Asked by <span className="text-white/50">{doubt.studentName}</span>
            </p>
          </div>
          <Link href={`/doubt/${doubt.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs text-white/30 hover:text-white cursor-pointer"
            >
              <HiOutlineArrowTopRightOnSquare className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Responses */}
        {doubt.responses.length > 0 && (
          <div className="space-y-3 border-t border-white/5 pt-4">
            {doubt.responses.map((response) => (
              <div
                key={response.id}
                className={`rounded-lg border p-3 ${
                  response.approved
                    ? "border-green-500/30 bg-green-500/5"
                    : response.source === "AI"
                    ? "border-purple-500/20 bg-purple-500/5"
                    : "border-amber-500/20 bg-amber-500/5"
                }`}
              >
                {/* Response header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {response.source === "AI" ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20">
                        <HiOutlineSparkles className="h-3 w-3 text-purple-400" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20">
                        <HiOutlineAcademicCap className="h-3 w-3 text-amber-400" />
                      </div>
                    )}
                    <span className="font-mono text-xs font-medium text-white">
                      {response.source === "AI" ? "AI Assistant" : response.userName}
                    </span>
                    {response.source === "TEACHER" && (
                      <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                        Teacher
                      </span>
                    )}
                    {response.approved && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-1.5 py-0.5 font-mono text-[10px] text-green-400">
                        <HiOutlineCheckCircle className="h-2.5 w-2.5" />
                        Approved
                      </span>
                    )}
                  </div>
                </div>

                {/* Response content */}
                <div className="mb-3">
                  <MarkdownRenderer
                    content={
                      response.content.startsWith("__DISAPPROVED__:")
                        ? response.content.replace("__DISAPPROVED__:", "")
                        : response.content
                    }
                  />
                </div>

                {/* Teacher actions */}
                {response.source === "AI" && (
                  <div className="flex gap-2">
                    {!response.approved ? (
                      <Button
                        onClick={() => onApprove(response.id)}
                        disabled={approveLoading}
                        size="sm"
                        className="font-mono text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 cursor-pointer"
                      >
                        <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onDisapprove(response.id)}
                        disabled={disapproveLoading}
                        size="sm"
                        className="font-mono text-xs bg-white/5 text-white/50 hover:bg-white/10 border border-white/10 cursor-pointer"
                      >
                        <HiOutlineXCircle className="mr-1 h-3 w-3" />
                        Disapprove
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No AI response yet */}
        {!hasAIResponse && doubt.status === "OPEN" && (
          <div className="border-t border-white/5 pt-4">
            <p className="font-mono text-xs text-white/30 mb-3">
              <HiOutlineClock className="inline h-3 w-3 mr-1 -mt-0.5" />
              No AI answer yet — write a teacher response instead
            </p>
          </div>
        )}

        {/* Teacher response form */}
        <TeacherResponseForm
          doubtId={doubt.id}
          doubtTitle={doubt.title}
        />
      </CardContent>
    </Card>
  );
}
