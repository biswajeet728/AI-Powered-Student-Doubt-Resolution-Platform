import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDoubt,
  updateDoubt,
  getMyDoubts,
  getDoubtById,
  getRecentDoubts,
  getDashboardStats,
  updateDoubtStatus,
  deleteDoubt,
} from "@/lib/actions/doubt";
import type { CreateDoubtInput, UpdateDoubtInput } from "@/lib/actions/doubt";

// ── Query keys ──────────────────────────────────────────────────────
export const doubtKeys = {
  all: ["doubts"] as const,
  my: (status?: string) => [...doubtKeys.all, "my", status] as const,
  detail: (id: string) => [...doubtKeys.all, "detail", id] as const,
  recent: (limit?: number) => [...doubtKeys.all, "recent", limit] as const,
  stats: () => [...doubtKeys.all, "stats"] as const,
};

// ── Queries ─────────────────────────────────────────────────────────
export function useMyDoubts(status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED") {
  return useQuery({
    queryKey: doubtKeys.my(status),
    queryFn: () => getMyDoubts(status),
  });
}

export function useDoubtById(id: string) {
  return useQuery({
    queryKey: doubtKeys.detail(id),
    queryFn: () => getDoubtById(id),
    enabled: !!id,
  });
}

export function useRecentDoubts(limit = 10) {
  return useQuery({
    queryKey: doubtKeys.recent(limit),
    queryFn: () => getRecentDoubts(limit),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: doubtKeys.stats(),
    queryFn: () => getDashboardStats(),
  });
}

// ── Mutations ───────────────────────────────────────────────────────
export function useCreateDoubt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDoubtInput) => createDoubt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
    },
  });
}

export function useUpdateDoubt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doubtId,
      input,
    }: {
      doubtId: string;
      input: UpdateDoubtInput;
    }) => updateDoubt(doubtId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: doubtKeys.detail(variables.doubtId) });
    },
  });
}

export function useUpdateDoubtStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doubtId,
      status,
    }: {
      doubtId: string;
      status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
    }) => updateDoubtStatus(doubtId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
      queryClient.invalidateQueries({ queryKey: doubtKeys.detail(variables.doubtId) });
    },
  });
}

export function useDeleteDoubt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doubtId: string) => deleteDoubt(doubtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doubtKeys.all });
    },
  });
}
