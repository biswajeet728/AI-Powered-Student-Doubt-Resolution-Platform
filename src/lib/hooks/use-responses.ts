import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherResponse,
  updateResponse,
  approveResponse,
  disapproveResponse,
  getDoubtsForReview,
  getTeacherStats,
} from "@/lib/actions/response";
import { doubtKeys } from "./use-doubts";

// ── Query keys ──────────────────────────────────────────────────────
export const responseKeys = {
  all: ["responses"] as const,
  review: (status?: string) => [...responseKeys.all, "review", status] as const,
  teacherStats: () => [...responseKeys.all, "teacherStats"] as const,
};

// ── Queries ─────────────────────────────────────────────────────────
export function useDoubtsForReview(status?: "OPEN" | "UNDER_REVIEW") {
  return useQuery({
    queryKey: responseKeys.review(status),
    queryFn: () => getDoubtsForReview(status),
  });
}

export function useTeacherStats() {
  return useQuery({
    queryKey: responseKeys.teacherStats(),
    queryFn: () => getTeacherStats(),
  });
}

// ── Mutations ───────────────────────────────────────────────────────
export function useCreateTeacherResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doubtId,
      content,
    }: {
      doubtId: string;
      content: string;
    }) => createTeacherResponse(doubtId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: responseKeys.all });
      queryClient.invalidateQueries({
        queryKey: doubtKeys.detail(variables.doubtId),
      });
    },
  });
}

export function useApproveResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) => approveResponse(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: responseKeys.all });
    },
  });
}

export function useDisapproveResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) => disapproveResponse(responseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: responseKeys.all });
    },
  });
}

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      content,
    }: {
      responseId: string;
      content: string;
    }) => updateResponse(responseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: responseKeys.all });
    },
  });
}
