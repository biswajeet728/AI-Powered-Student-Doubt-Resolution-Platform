"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateDoubt } from "@/lib/hooks/use-doubts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/markdown-editor";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface EditDoubtModalProps {
  doubtId: string;
  initialData: {
    title: string;
    body: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    subjectId?: string;
  };
  subjects: SubjectWithCount[];
  open: boolean;
  onClose: () => void;
}

export default function EditDoubtModal({
  doubtId,
  initialData,
  subjects,
  open,
  onClose,
}: EditDoubtModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [body, setBody] = useState(initialData.body);
  const [subjectId, setSubjectId] = useState(initialData.subjectId || "");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    initialData.difficulty,
  );

  const updateDoubtMutation = useUpdateDoubt();

  // Reset form when modal opens with new data
  useEffect(() => {
    if (open) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setSubjectId(initialData.subjectId || "");
      setDifficulty(initialData.difficulty);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    const result = await updateDoubtMutation.mutateAsync({
      doubtId,
      input: {
        title,
        body,
        subjectId: subjectId || undefined,
        difficulty,
      },
    });

    if (result.success) {
      toast.success("Doubt updated!");
      onClose();
    } else {
      toast.error(result.error || "Failed to update doubt");
    }
  };

  const isLoading = updateDoubtMutation.isPending;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-xl border-white/10 bg-[#2a2826]/95 backdrop-blur-md shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlinePencilSquare className="h-5 w-5 text-amber-400" />
                <CardTitle className="font-mono text-lg text-white">
                  Edit Doubt
                </CardTitle>
              </div>
              <p className="font-mono text-xs text-white/40 mt-1">
                Press{" "}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                  Esc
                </kbd>{" "}
                to cancel
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="font-mono text-sm text-white/70">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your question?"
                  className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label className="font-mono text-sm text-white/70">
                  Description
                </Label>
                <MarkdownEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Describe your doubt in detail..."
                  minHeight={180}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="edit-subject" className="font-mono text-sm text-white/70">
                  Subject
                </Label>
                <select
                  id="edit-subject"
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

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="font-mono flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="font-mono flex-1 bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
