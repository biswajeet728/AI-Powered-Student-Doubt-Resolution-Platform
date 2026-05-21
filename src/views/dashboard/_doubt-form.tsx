"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateDoubt } from "@/lib/hooks/use-doubts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/markdown-editor";
import { HiOutlineSparkles } from "react-icons/hi2";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface DoubtFormProps {
  subjects: SubjectWithCount[];
  onSuccess?: (doubtId: string) => void;
}

export default function DoubtForm({ subjects, onSuccess }: DoubtFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");

  const createDoubtMutation = useCreateDoubt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    const result = await createDoubtMutation.mutateAsync({
      title,
      body,
      subjectId: subjectId || undefined,
      difficulty,
    });

    if (result.success) {
      toast.success("Doubt posted! AI will answer shortly.");
      setTitle("");
      setBody("");
      setSubjectId("");
      setDifficulty("MEDIUM");
      if (onSuccess) {
        onSuccess(result.doubtId!);
      } else {
        router.push(`/doubt/${result.doubtId}`);
      }
    } else {
      toast.error(result.error || "Failed to post doubt");
    }
  };

  const isLoading = createDoubtMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="modal-title" className="font-mono text-sm text-white/70">
          Title
        </Label>
        <Input
          id="modal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your question?"
          className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
          autoFocus
        />
      </div>

      {/* Body — Markdown Editor */}
      <div className="space-y-2">
        <Label className="font-mono text-sm text-white/70">
          Description
        </Label>
        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder="Describe your doubt in detail. Use markdown for code blocks, lists, etc."
          minHeight={180}
        />
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="modal-subject" className="font-mono text-sm text-white/70">
          Subject
        </Label>
        <select
          id="modal-subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white focus:border-amber-500/50 outline-none cursor-pointer"
        >
          <option value="" className="bg-[#2a2826]">
            Select a subject
          </option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id} className="bg-[#2a2826]">
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label className="font-mono text-sm text-white/70">Difficulty</Label>
        <div className="flex gap-2">
          {(["EASY", "MEDIUM", "HARD"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`flex-1 rounded-lg border px-3 py-2.5 font-mono text-xs transition-all cursor-pointer ${
                difficulty === d
                  ? d === "EASY"
                    ? "border-green-500/50 bg-green-500/15 text-green-400"
                    : d === "MEDIUM"
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                    : "border-red-500/50 bg-red-500/15 text-red-400"
                  : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="font-mono w-full bg-amber-500 text-black hover:bg-amber-400 cursor-pointer py-5"
      >
        {isLoading ? (
          "Posting..."
        ) : (
          <>
            <HiOutlineSparkles className="mr-2 h-4 w-4" />
            Post & Get AI Answer
          </>
        )}
      </Button>
    </form>
  );
}
