"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDoubtById, useUpdateDoubtStatus, useDeleteDoubt } from "@/lib/hooks/use-doubts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarkdownRenderer from "@/components/markdown-renderer";
import {
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

interface DoubtDetail {
  id: string;
  title: string;
  body: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string; role: string };
  subject: { name: string } | null;
  responses: {
    id: string;
    content: string;
    source: "AI" | "TEACHER";
    approved: boolean;
    createdAt: Date;
    user: { id: string; name: string; role: string } | null;
  }[];
}

interface DoubtDetailViewProps {
  doubtId: string;
  initialDoubt: DoubtDetail;
  currentUserId?: string;
}

const statusConfig = {
  OPEN: { label: "Open", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  RESOLVED: { label: "Resolved", className: "bg-green-500/15 text-green-400 border-green-500/20" },
};

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

export default function DoubtDetailView({ doubtId, initialDoubt, currentUserId }: DoubtDetailViewProps) {
  const router = useRouter();

  const { data: result } = useDoubtById(doubtId);
  const updateMutation = useUpdateDoubtStatus();
  const deleteMutation = useDeleteDoubt();

  // Use fresh data from query or fall back to initial SSR data
  const doubt = result?.success ? result.doubt! : initialDoubt;

  const isOwner = doubt.user.id === currentUserId;
  const status = statusConfig[doubt.status];
  const diff = diffConfig[doubt.difficulty];

  const handleDelete = async () => {
    const res = await deleteMutation.mutateAsync(doubt.id);
    if (res.success) {
      toast.success("Doubt deleted");
      router.push("/my-doubts");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleResolve = async () => {
    const res = await updateMutation.mutateAsync({
      doubtId: doubt.id,
      status: "RESOLVED",
    });
    if (res.success) {
      toast.success("Marked as resolved!");
    } else {
      toast.error(res.error || "Failed to update");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {/* Doubt Card */}
      <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm mb-6">
        <CardContent className="p-6">
          {/* Top meta */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${status.className}`}>
                {status.label}
              </span>
              <span className={`font-mono text-xs rounded px-1.5 py-0.5 ${diff}`}>
                {doubt.difficulty.charAt(0) + doubt.difficulty.slice(1).toLowerCase()}
              </span>
              {doubt.subject && (
                <span className="font-mono text-xs text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                  {doubt.subject.name}
                </span>
              )}
            </div>
            {isOwner && (
              <div className="flex items-center gap-1">
                {doubt.status !== "RESOLVED" && (
                  <button
                    onClick={handleResolve}
                    disabled={updateMutation.isPending}
                    className="p-1.5 rounded-md text-white/20 hover:text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Mark resolved"
                  >
                    <HiOutlineCheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="font-mono text-xl font-bold text-white mb-3">
            {doubt.title}
          </h1>

          {/* Body — Markdown rendered */}
          <MarkdownRenderer content={doubt.body} className="mb-4" />

          {/* Author + time */}
          <div className="flex items-center gap-2 text-xs font-mono text-white/30">
            <HiOutlineUser className="h-3.5 w-3.5" />
            <span>{doubt.user.name}</span>
            <span>·</span>
            <span>{formatDate(doubt.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <div className="mb-4">
        <h2 className="font-mono text-sm font-semibold text-white mb-3">
          Responses ({doubt.responses.length})
        </h2>

        {doubt.responses.length === 0 ? (
          <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <HiOutlineSparkles className="mb-3 h-8 w-8 text-white/15" />
              <p className="font-mono text-sm text-white/40">
                No responses yet
              </p>
              <p className="font-mono text-xs text-white/25 mt-1">
                AI will generate an answer shortly
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {doubt.responses.map((response) => (
              <Card
                key={response.id}
                className={`border-white/10 bg-[#2a2826]/80 backdrop-blur-sm ${
                  response.approved ? "border-green-500/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  {/* Response header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {response.source === "AI" ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                          <HiOutlineSparkles className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                          <HiOutlineAcademicCap className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                      )}
                      <span className="font-mono text-xs font-medium text-white">
                        {response.source === "AI" ? "AI Assistant" : response.user?.name}
                      </span>
                      {response.source === "TEACHER" && (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
                          Teacher
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {response.approved && (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 font-mono text-[10px] text-green-400">
                          <HiOutlineCheckCircle className="h-3 w-3" />
                          Approved
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-white/20">
                        {formatDate(response.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Response content — Markdown rendered */}
                  <MarkdownRenderer content={response.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
