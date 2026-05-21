"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineArrowLeft, HiOutlineDocumentText } from "react-icons/hi2";
import DoubtForm from "./_doubt-form";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface AskDoubtPageViewProps {
  subjects: SubjectWithCount[];
}

export default function AskDoubtPageView({ subjects }: AskDoubtPageViewProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
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
          <DoubtForm subjects={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
