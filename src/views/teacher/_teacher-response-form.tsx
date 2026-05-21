"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateTeacherResponse } from "@/lib/hooks/use-responses";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/markdown-editor";
import { HiOutlinePaperAirplane, HiOutlineSparkles } from "react-icons/hi2";

interface TeacherResponseFormProps {
  doubtId: string;
  doubtTitle: string;
  onSuccess?: () => void;
}

export default function TeacherResponseForm({
  doubtId,
  doubtTitle,
  onSuccess,
}: TeacherResponseFormProps) {
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);
  const mutation = useCreateTeacherResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Response content is required");
      return;
    }

    const result = await mutation.mutateAsync({ doubtId, content });
    if (result.success) {
      toast.success("Response posted!");
      setContent("");
      setExpanded(false);
      onSuccess?.();
    } else {
      toast.error(result.error || "Failed to post response");
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-3 font-mono text-xs text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <HiOutlineSparkles className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
        Write a response for:{" "}
        {doubtTitle.length > 50 ? doubtTitle.slice(0, 50) + "..." : doubtTitle}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-[#2a2826] p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-medium text-white/50">
          Writing response as <span className="text-amber-400">Teacher</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setContent("");
          }}
          className="font-mono text-xs text-white/30 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="Write your response... Use markdown for formatting."
        minHeight={150}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          size="sm"
          className="font-mono text-xs bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
        >
          {mutation.isPending ? (
            "Posting..."
          ) : (
            <>
              <HiOutlinePaperAirplane className="mr-1.5 h-3.5 w-3.5" />
              Post Response
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
