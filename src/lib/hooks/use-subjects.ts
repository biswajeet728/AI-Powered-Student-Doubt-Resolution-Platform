import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "@/lib/actions/subject";

export const subjectKeys = {
  all: ["subjects"] as const,
};

export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.all,
    queryFn: () => getSubjects(),
    staleTime: 60 * 1000,
  });
}
