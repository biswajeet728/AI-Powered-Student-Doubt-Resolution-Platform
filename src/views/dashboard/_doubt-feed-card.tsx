"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useApproveResponse } from "@/lib/hooks/use-responses";
import { useUpdateDoubtStatus } from "@/lib/hooks/use-doubts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/markdown-renderer";
import {
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import type { Doubt } from "./_dashboard-data";

const statusConfig = {
  OPEN: {
    label: "Open",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-green-500/15 text-green-400 border-green-500/20",
  },
};

const diffConfig = {
  EASY: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-amber-500/10 text-amber-400",
  HARD: "bg-red-500/10 text-red-400",
};

interface DoubtFeedCardProps {
  doubt: Doubt;
  isTeacher: boolean;
}

export default function DoubtFeedCard({
  doubt,
  isTeacher,
}: DoubtFeedCardProps) {
  const status = statusConfig[doubt.status];
  const diff = diffConfig[doubt.difficulty];

  const approveMutation = useApproveResponse();
  const updateStatusMutation = useUpdateDoubtStatus();

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!doubt.aiResponseId) return;

    const result = await approveMutation.mutateAsync(doubt.aiResponseId);
    if (result.success) {
      toast.success("AI answer approved!");
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleOverride = async (e: React.MouseEvent) => {
    e.preventDefault();

    const result = await updateStatusMutation.mutateAsync({
      doubtId: doubt.id,
      status: "UNDER_REVIEW",
    });
    if (result.success) {
      toast.success(
        "Moved to review — write a teacher response on the detail page",
      );
    } else {
      toast.error(result.error || "Failed to update");
    }
  };

  return (
    <Link href={`/doubt/${doubt.id}`}>
      <Card className="group cursor-pointer border-white/10 bg-[#2a2826]/80 backdrop-blur-sm transition-all hover:border-amber-500/20 hover:bg-[#2a2826]">
        <CardContent className="px-4 py-1">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-mono text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {doubt.title}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Body preview — Markdown rendered (truncated) */}
          <div className="line-clamp-2">
            <MarkdownRenderer content={doubt.body} />
          </div>

          {/* AI answer preview */}
          {doubt.aiAnswer && (
            <div
              className={`rounded-lg border px-3 py-2 mb-3 mt-2 ${
                doubt.aiApproved
                  ? "border-green-500/30 bg-green-500/5"
                  : doubt.aiAnswer.startsWith("__DISAPPROVED__:")
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-purple-500/20 bg-purple-500/5"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <HiOutlineSparkles className="h-3 w-3 text-purple-400" />
                <span className="font-mono text-[10px] font-semibold text-purple-400">
                  AI Answer
                </span>
                {doubt.aiApproved ? (
                  <span className="flex items-center gap-0.5 rounded-full bg-green-500/15 px-1.5 py-0.5 font-mono text-[10px] text-green-400">
                    <HiOutlineCheckCircle className="h-2.5 w-2.5" />
                    Verified
                  </span>
                ) : doubt.aiAnswer.startsWith("__DISAPPROVED__:") ? (
                  <span className="flex items-center gap-0.5 rounded-full bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] text-red-400">
                    Not Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                    Pending Approval
                  </span>
                )}
              </div>
              {!doubt.aiAnswer.startsWith("__DISAPPROVED__:") && (
                <p className="font-mono text-xs text-white/40 line-clamp-1">
                  {doubt.aiAnswer}
                </p>
              )}
            </div>
          )}

          {/* Bottom meta */}
          <div className="flex items-center justify-between pt-0.5 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                {doubt.subject}
              </span>
              <span
                className={`font-mono text-[10px] rounded px-1.5 py-0.5 ${diff}`}
              >
                {doubt.difficulty.charAt(0) +
                  doubt.difficulty.slice(1).toLowerCase()}
              </span>
              {doubt.tags.slice(0, 1).map((t) => (
                <span key={t} className="font-mono text-[10px] text-white/20">
                  #{t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 shrink-0">
              {isTeacher && <span>{doubt.studentName}</span>}
              <span>{doubt.createdAt}</span>
            </div>
          </div>

          {/* Teacher action row */}
          {isTeacher && doubt.status === "OPEN" && (
            <div className="flex gap-2 pt-3 border-t border-white/5">
              {doubt.aiResponseId && !doubt.aiApproved && (
                <Button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  size="sm"
                  className="rounded-md bg-green-500/10 border border-green-500/20 px-2.5 py-1 font-mono text-[10px] text-green-400 hover:bg-green-500/20 transition-colors cursor-pointer"
                >
                  <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              )}
              <Button
                onClick={handleOverride}
                disabled={updateStatusMutation.isPending}
                size="sm"
                className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 font-mono text-[10px] text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <HiOutlineAcademicCap className="mr-1 h-3 w-3" />
                {updateStatusMutation.isPending ? "Moving..." : "Override"}
              </Button>
            </div>
          )}

          {isTeacher && doubt.status === "UNDER_REVIEW" && (
            <div className="pt-3 border-t border-white/5">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400">
                <HiOutlineChatBubbleLeftRight className="h-3 w-3" />
                In review — write your response
                <HiOutlineArrowRight className="h-3 w-3 ml-auto" />
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
