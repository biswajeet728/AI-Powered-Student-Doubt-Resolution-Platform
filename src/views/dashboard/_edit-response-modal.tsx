"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useUpdateResponse } from "@/lib/hooks/use-responses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/markdown-editor";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";

interface EditResponseModalProps {
  responseId: string;
  initialContent: string;
  open: boolean;
  onClose: () => void;
}

export default function EditResponseModal({
  responseId,
  initialContent,
  open,
  onClose,
}: EditResponseModalProps) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const mutation = useUpdateResponse();

  useEffect(() => {
    if (open) {
      setContent(initialContent);
    }
  }, [open, initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Response content is required");
      return;
    }

    startTransition(async () => {
      const result = await mutation.mutateAsync({ responseId, content });
      if (result.success) {
        toast.success("Response updated!");
        onClose();
      } else {
        toast.error(result.error || "Failed to update response");
      }
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-xl border-white/10 bg-[#2a2826]/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlinePencilSquare className="h-5 w-5 text-amber-400" />
                <CardTitle className="font-mono text-lg text-white">
                  Edit Response
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Edit your response..."
                minHeight={180}
              />
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
                  disabled={isPending}
                  className="font-mono flex-1 bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
