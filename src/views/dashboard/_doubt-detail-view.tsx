"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useDoubtById,
  useUpdateDoubtStatus,
  useDeleteDoubt,
} from "@/lib/hooks/use-doubts";
import {
  useApproveResponse,
  useDisapproveResponse,
} from "@/lib/hooks/use-responses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarkdownRenderer from "@/components/markdown-renderer";
import EditDoubtModal from "./_edit-doubt-modal";
import EditResponseModal from "./_edit-response-modal";
import TeacherResponseForm from "@/views/teacher/_teacher-response-form";
import {
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineAcademicCap,
  HiOutlinePencilSquare,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface DoubtDetail {
  id: string;
  title: string;
  body: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  subjectId?: string | null;
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
  currentUserRole?: string;
  subjects: SubjectWithCount[];
}

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function DoubtDetailView({
  doubtId,
  initialDoubt,
  currentUserId,
  currentUserRole,
  subjects,
}: DoubtDetailViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const { data: result } = useDoubtById(doubtId);
  const updateMutation = useUpdateDoubtStatus();
  const deleteMutation = useDeleteDoubt();
  const approveMutation = useApproveResponse();
  const disapproveMutation = useDisapproveResponse();

  const doubt = result?.success ? result.doubt! : initialDoubt;

  // AI is generating when doubt has no AI response yet and is not resolved
  const isAiGenerating =
    doubt.status !== "RESOLVED" &&
    !doubt.responses.some((r) => r.source === "AI");

  const isOwner = doubt.user.id === currentUserId;
  const isTeacher = currentUserRole === "TEACHER";
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

  const handleApprove = async (responseId: string) => {
    const res = await approveMutation.mutateAsync(responseId);
    if (res.success) {
      toast.success("Response approved!");
    } else {
      toast.error(res.error || "Failed to approve");
    }
  };

  const handleDisapprove = async (responseId: string) => {
    const res = await disapproveMutation.mutateAsync(responseId);
    if (res.success) {
      toast.success("Response disapproved");
    } else {
      toast.error(res.error || "Failed to disapprove");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col h-[calc(100vh-4rem)] px-4 py-4">
        {/* Top bar */}
        <div className="mb-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
            <span className={`font-mono text-xs rounded px-1.5 py-0.5 ${diff}`}>
              {doubt.difficulty.charAt(0) +
                doubt.difficulty.slice(1).toLowerCase()}
            </span>
            {doubt.subject && (
              <span className="font-mono text-xs text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                {doubt.subject.name}
              </span>
            )}
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* ── Left Panel: Doubt ──────────────────────────────── */}
          <div className="lg:w-[55%] flex flex-col min-h-0">
            <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Card header — fixed */}
              <div className="p-5 pb-0 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="font-mono text-lg font-bold text-white pr-4">
                    {doubt.title}
                  </h1>

                  {/* Owner actions */}
                  {isOwner && (
                    <div className="flex items-center gap-1 shrink-0">
                      {/* {doubt.status !== "RESOLVED" && (
                        <button
                          onClick={() => setEditOpen(true)}
                          disabled={updateMutation.isPending}
                          className="p-1.5 rounded-md text-white/20 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="h-4 w-4" />
                        </button>
                      )} */}
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

                  {/* Teacher resolve */}
                  {isTeacher && !isOwner && doubt.status !== "RESOLVED" && (
                    <button
                      onClick={handleResolve}
                      disabled={updateMutation.isPending}
                      className="p-1.5 rounded-md text-white/20 hover:text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      title="Mark resolved"
                    >
                      <HiOutlineCheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto px-5 pb-4">
                <MarkdownRenderer content={doubt.body} className="mb-4" />
              </div>

              {/* Author — fixed bottom */}
              <div className="shrink-0 border-t border-white/5 px-5 py-3 flex items-center gap-2 text-xs font-mono text-white/30">
                <HiOutlineUser className="h-3.5 w-3.5" />
                <span>{doubt.user.name}</span>
                <span className="text-white/10">|</span>
                <HiOutlineClock className="h-3 w-3" />
                <span>{formatDate(doubt.createdAt)}</span>
              </div>
            </Card>
          </div>

          {/* ── Right Panel: Responses ─────────────────────────── */}
          <div className="lg:w-[55%] flex flex-col min-h-0">
            <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Response header — fixed */}
              <div className="p-4 pb-0 shrink-0 flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold text-white flex items-center gap-2">
                  <HiOutlineSparkles className="h-4 w-4 text-purple-400" />
                  Responses
                  <span className="text-white/30 font-normal">
                    ({doubt.responses.length})
                  </span>
                </h2>
              </div>

              {/* Responses list — scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {doubt.responses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {isAiGenerating ? (
                      <>
                        {/* AI loading indicator */}
                        <div className="relative h-12 w-12">
                          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/15">
                            <HiOutlineSparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                          </div>
                        </div>
                        <p className="font-mono text-sm font-medium text-purple-400">
                          AI is generating your answer
                        </p>
                        <p className="font-mono text-xs text-white/30">
                          This usually takes a few seconds...
                        </p>
                      </>
                    ) : (
                      <>
                        <HiOutlineSparkles className="h-8 w-8 text-white/15" />
                        <p className="font-mono text-sm text-white/40">
                          No responses yet
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {doubt.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`rounded-lg border p-3.5 ${
                          response.approved
                            ? "border-green-500/30 bg-green-500/5"
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
                                : response.user?.name}
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
                            <span className="font-mono text-[10px] text-white/20">
                              {formatDate(response.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Response content */}
                        {!isTeacher &&
                        response.source === "AI" &&
                        !response.approved &&
                        response.content.startsWith("__DISAPPROVED__:") ? (
                          /* Disapproved state */
                          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center">
                            <p className="font-mono text-xs font-medium text-red-400">
                              This AI answer was reviewed and not approved by a
                              teacher
                            </p>
                            <p className="font-mono text-[10px] text-white/60 mt-1">
                              A teacher will provide their own response soon
                            </p>
                          </div>
                        ) : !isTeacher &&
                          response.source === "AI" &&
                          !response.approved ? (
                          /* Pending approval state */
                          <div className="relative">
                            <div className="max-h-20 overflow-hidden">
                              <MarkdownRenderer content={response.content} />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-[#2a2826]/95 pointer-events-none" />
                            <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                              <p className="font-mono text-xs text-amber-400">
                                This answer is generated by Doubt-Flow AI
                              </p>
                              <p className="font-mono text-[10px] text-white mt-1">
                                A teacher will verify and approve it soon
                              </p>
                            </div>
                          </div>
                        ) : (
                          <MarkdownRenderer
                            content={
                              response.content.startsWith("__DISAPPROVED__:")
                                ? response.content.replace(
                                    "__DISAPPROVED__:",
                                    "",
                                  )
                                : response.content
                            }
                          />
                        )}

                        {/* Teacher actions on AI responses */}
                        {isTeacher &&
                          response.source === "AI" &&
                          doubt.status !== "RESOLVED" && (
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
                                  onClick={() => handleDisapprove(response.id)}
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

                        {/* Edit button for own teacher responses */}
                        {isTeacher &&
                          response.source === "TEACHER" &&
                          response.user?.id === currentUserId && (
                            <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-white/5">
                              <Button
                                onClick={() =>
                                  setEditingResponse({
                                    id: response.id,
                                    content: response.content,
                                  })
                                }
                                size="sm"
                                className="font-mono text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer"
                              >
                                <HiOutlinePencilSquare className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                            </div>
                          )}
                      </div>
                    ))}

                    {/* AI loading indicator — shown below responses while AI is generating */}
                    {isAiGenerating && (
                      <div className="flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                        <div className="relative h-8 w-8 shrink-0">
                          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
                          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15">
                            <HiOutlineSparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                          </div>
                        </div>
                        <div>
                          <p className="font-mono text-xs font-medium text-purple-400">
                            AI is generating your answer
                          </p>
                          <p className="font-mono text-[10px] text-white/30">
                            This usually takes a few seconds...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Teacher response form — fixed bottom */}
              {isTeacher && doubt.status !== "RESOLVED" && (
                <div className="shrink-0 border-t border-white/5 p-4">
                  <TeacherResponseForm
                    doubtId={doubt.id}
                    doubtTitle={doubt.title}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        {isOwner && (
          <EditDoubtModal
            doubtId={doubt.id}
            initialData={{
              title: doubt.title,
              body: doubt.body,
              difficulty: doubt.difficulty,
              subjectId: doubt.subjectId ?? undefined,
            }}
            subjects={subjects}
            open={editOpen}
            onClose={() => setEditOpen(false)}
          />
        )}

        {/* Edit Response Modal */}
        {isTeacher && editingResponse && (
          <EditResponseModal
            responseId={editingResponse.id}
            initialContent={editingResponse.content}
            open={!!editingResponse}
            onClose={() => setEditingResponse(null)}
          />
        )}
      </div>
    </div>
  );
}
