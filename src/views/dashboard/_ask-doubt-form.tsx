"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDoubt } from "@/lib/actions/doubt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  HiOutlineSparkles,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface AskDoubtFormProps {
  subjects: SubjectWithCount[];
}

export default function AskDoubtForm({ subjects }: AskDoubtFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    startTransition(async () => {
      const result = await createDoubt({
        title,
        body,
        subjectId: subjectId || undefined,
        difficulty,
      });

      if (result.success) {
        toast.success("Doubt posted! AI will answer shortly.");
        router.push(`/doubt/${result.doubtId}`);
      } else {
        toast.error(result.error || "Failed to post doubt");
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HiOutlineDocumentText className="h-5 w-5 text-amber-400" />
            <CardTitle className="font-mono text-lg text-white">
              Ask a Doubt
            </CardTitle>
          </div>
          <p className="font-mono text-xs text-white/40 mt-1">
            Be specific and detailed. AI will generate an answer instantly.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-mono text-sm text-white/70">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question?"
                className="font-mono border-white/10 bg-white/5 text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20"
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body" className="font-mono text-sm text-white/70">
                Description
              </Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe your doubt in detail. Include what you already know and what confuses you..."
                rows={5}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-white/25 focus-visible:border-amber-500/50 focus-visible:ring-amber-500/20 focus-visible:ring-1 outline-none resize-none"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="font-mono text-sm text-white/70">
                Subject
              </Label>
              <select
                id="subject"
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
              <Label className="font-mono text-sm text-white/70">
                Difficulty
              </Label>
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
              disabled={isPending}
              className="font-mono w-full bg-amber-500 text-black hover:bg-amber-400 cursor-pointer py-5"
            >
              {isPending ? (
                "Posting..."
              ) : (
                <>
                  <HiOutlineSparkles className="mr-2 h-4 w-4" />
                  Post & Get AI Answer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
