"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useDoubtsForReview,
  useApproveResponse,
  useDisapproveResponse,
} from "@/lib/hooks/use-responses";
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
  HiOutlineUser,
  HiOutlineArrowLeft,
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

export default function ReviewView({
  initialDoubts,
  initialStats,
}: ReviewViewProps) {
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "OPEN" | "UNDER_REVIEW" | "RESOLVED"
  >("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: doubts = initialDoubts } = useDoubtsForReview(
    activeFilter === "ALL" ? undefined : activeFilter,
  );

  const approveMutation = useApproveResponse();
  const disapproveMutation = useDisapproveResponse();

  const selectedDoubt = selectedId
    ? doubts.find((d) => d.id === selectedId)
    : null;

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
    <div className="mx-auto max-w-7xl py-6">
      <div className="flex flex-col h-[calc(100vh-4rem)] px-4 py-4">
        {/* Stats bar */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="font-mono text-xl font-bold text-amber-400">
                {initialStats.pending}
              </p>
              <p className="font-mono text-[10px] text-white/40">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="font-mono text-xl font-bold text-green-400">
                {initialStats.approvedAI}
              </p>
              <p className="font-mono text-[10px] text-white/40">AI Approved</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="font-mono text-xl font-bold text-blue-400">
                {initialStats.totalAI}
              </p>
              <p className="font-mono text-[10px] text-white/40">Total AI</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="font-mono text-xl font-bold text-purple-400">
                {initialStats.reviewed}
              </p>
              <p className="font-mono text-[10px] text-white/40">Responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* ── Left Panel: Doubt List ────────────────────────── */}
          <div className="lg:w-[40%] flex flex-col min-h-0">
            {/* Filters */}
            <div className="flex gap-1 mb-3 shrink-0">
              {(["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    setSelectedId(null);
                  }}
                  className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                    activeFilter === f
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-white/40 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {f === "ALL"
                    ? "All"
                    : f
                        .replace("_", " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Doubt list — scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {doubts.length === 0 ? (
                <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <HiOutlineCheckCircle className="mb-3 h-10 w-10 text-green-400/30" />
                    <p className="font-mono text-sm text-white/40">
                      All caught up!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                doubts.map((doubt) => {
                  const diff = diffConfig[doubt.difficulty];
                  const isSelected = selectedId === doubt.id;
                  const hasAI = doubt.responses.some((r) => r.source === "AI");
                  const hasApproved = doubt.responses.some(
                    (r) => r.source === "AI" && r.approved,
                  );

                  return (
                    <button
                      key={doubt.id}
                      onClick={() => setSelectedId(doubt.id)}
                      className={`w-full text-left rounded-lg border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-amber-500/40 bg-amber-500/10"
                          : "border-white/10 bg-[#2a2826]/80 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3
                          className={`font-mono text-sm font-semibold line-clamp-1 ${
                            isSelected ? "text-amber-300" : "text-white"
                          }`}
                        >
                          {doubt.title}
                        </h3>
                        {hasApproved ? (
                          <HiOutlineCheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                        ) : hasAI ? (
                          <HiOutlineSparkles className="h-4 w-4 text-purple-400 shrink-0" />
                        ) : (
                          <HiOutlineClock className="h-4 w-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                          {doubt.subject}
                        </span>
                        <span
                          className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${diff}`}
                        >
                          {doubt.difficulty.charAt(0) +
                            doubt.difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className="font-mono text-[10px] text-white/20">
                          {doubt.responseCount} response
                          {doubt.responseCount !== 1 ? "s" : ""}
                        </span>
                        <span className="font-mono text-[10px] text-white/20 ml-auto">
                          by {doubt.studentName}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right Panel: Selected Doubt Detail ───────────── */}
          <div className="lg:w-[60%] flex flex-col min-h-0">
            <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              {selectedDoubt ? (
                <>
                  {/* Header — fixed */}
                  <div className="p-4 pb-0 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setSelectedId(null)}
                        className="lg:hidden flex items-center gap-1 font-mono text-xs text-white/40 hover:text-white cursor-pointer"
                      >
                        <HiOutlineArrowLeft className="h-3.5 w-3.5" />
                        Back
                      </button>
                      <Link
                        href={`/doubt/${selectedDoubt.id}`}
                        className="font-mono text-xs text-white/30 hover:text-white ml-auto"
                      >
                        <HiOutlineArrowTopRightOnSquare className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <h2 className="font-mono text-lg font-bold text-white">
                      {selectedDoubt.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${
                          diffConfig[selectedDoubt.difficulty]
                        }`}
                      >
                        {selectedDoubt.difficulty.charAt(0) +
                          selectedDoubt.difficulty.slice(1).toLowerCase()}
                      </span>
                      <span className="font-mono text-[10px] text-white/30">
                        by {selectedDoubt.studentName}
                      </span>
                      <span className="font-mono text-[10px] text-white/20">
                        {formatDate(selectedDoubt.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Doubt body — scrollable */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <MarkdownRenderer content={selectedDoubt.body} />

                    {/* Responses */}
                    {selectedDoubt.responses.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h3 className="font-mono text-xs font-semibold text-white/50 uppercase tracking-wider">
                          Responses ({selectedDoubt.responses.length})
                        </h3>
                        {selectedDoubt.responses.map((response) => {
                          const isDisapproved =
                            response.content.startsWith("__DISAPPROVED__:");
                          const displayContent = isDisapproved
                            ? response.content.replace("__DISAPPROVED__:", "")
                            : response.content;

                          return (
                            <div
                              key={response.id}
                              className={`rounded-lg border p-3.5 ${
                                response.approved
                                  ? "border-green-500/30 bg-green-500/5"
                                  : isDisapproved
                                    ? "border-red-500/20 bg-red-500/5"
                                    : response.source === "AI"
                                      ? "border-purple-500/20 bg-purple-500/5"
                                      : "border-amber-500/20 bg-amber-500/5"
                              }`}
                            >
                              {/* Response header */}
                              <div className="flex items-center justify-between mb-2.5">
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
                                    {response.source === "AI"
                                      ? "AI Assistant"
                                      : response.userName}
                                  </span>
                                  {response.source === "TEACHER" && (
                                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                                      Teacher
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {response.approved && (
                                    <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-1.5 py-0.5 font-mono text-[10px] text-green-400">
                                      <HiOutlineCheckCircle className="h-2.5 w-2.5" />
                                      Approved
                                    </span>
                                  )}
                                  {isDisapproved && (
                                    <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] text-red-400">
                                      <HiOutlineXCircle className="h-2.5 w-2.5" />
                                      Disapproved
                                    </span>
                                  )}
                                  <span className="font-mono text-[10px] text-white/20">
                                    {formatDate(response.createdAt)}
                                  </span>
                                </div>
                              </div>

                              {/* Response content */}
                              <MarkdownRenderer content={displayContent} />

                              {/* Teacher actions on AI responses */}
                              {response.source === "AI" && !isDisapproved && (
                                <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-white/5">
                                  {!response.approved ? (
                                    <Button
                                      onClick={() => handleApprove(response.id)}
                                      disabled={approveMutation.isPending}
                                      size="sm"
                                      className="font-mono text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 cursor-pointer"
                                    >
                                      <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                                      Approve
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        handleDisapprove(response.id)
                                      }
                                      disabled={disapproveMutation.isPending}
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
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Teacher response form — fixed bottom */}
                  <div className="shrink-0 border-t border-white/5 p-4">
                    <TeacherResponseForm
                      doubtId={selectedDoubt.id}
                      doubtTitle={selectedDoubt.title}
                    />
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full">
                  <HiOutlineChatBubbleLeftRight className="mb-3 h-10 w-10 text-white/15" />
                  <p className="font-mono text-sm text-white/40">
                    Select a doubt to review
                  </p>
                  <p className="font-mono text-xs text-white/25 mt-1">
                    Click on a doubt from the list on the left
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
