"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineSparkles, HiOutlineXMark } from "react-icons/hi2";
import DoubtForm from "./_doubt-form";
import { useSubjects } from "@/lib/hooks/use-subjects";

export default function AskDoubtModal() {
  const { data: subjects = [] } = useSubjects();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "q") {
      // Don't trigger if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSuccess = (doubtId: string) => {
    setOpen(false);
    router.push(`/doubt/${doubtId}`);
  };

  return (
    <>
      {/* Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <Card className="w-full max-w-xl border-white/10 bg-[#2a2826]/95 backdrop-blur-md shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <HiOutlineSparkles className="h-5 w-5 text-amber-400" />
                    <CardTitle className="font-mono text-lg text-white">
                      Ask a Doubt
                    </CardTitle>
                  </div>
                  <p className="font-mono text-xs text-white/40 mt-1">
                    Press{" "}
                    <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                      Esc
                    </kbd>{" "}
                    to close
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <DoubtForm subjects={subjects} onSuccess={handleSuccess} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
