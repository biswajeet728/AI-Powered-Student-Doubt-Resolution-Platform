"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { useSubjects } from "@/lib/hooks/use-subjects";
import SubjectFilter from "./_subject-filter";

interface RightSidebarProps {
  selectedSubject: string | null;
  onSelectSubject: (subject: string | null) => void;
}

export default function RightSidebar({
  selectedSubject,
  onSelectSubject,
}: RightSidebarProps) {
  const { data: subjects = [], isPending } = useSubjects();

  return (
    <div className="flex flex-col gap-4">
      {/* Filter by Tags */}
      {/* <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <HiOutlineTag className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-xs font-semibold text-white">
              Filter by Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DUMMY_TAGS.map((tag) => (
              <button
                key={tag.label}
                className="group flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/50 transition-all hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300 cursor-pointer"
              >
                {tag.label}
                <span className="rounded-full bg-white/10 px-1 text-[10px] text-white/30 group-hover:bg-amber-500/20 group-hover:text-amber-400">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Filter by Subjects */}
      <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <HiOutlineBookOpen className="h-4 w-4 text-blue-400" />
            <span className="font-mono text-xs font-semibold text-white">
              Filter by Subject
            </span>
          </div>
          {isPending ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 animate-pulse w-full py-4 rounded-lg"
                />
              ))}
            </div>
          ) : subjects.length > 0 ? (
            <SubjectFilter
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSelect={onSelectSubject}
            />
          ) : (
            <p className="font-mono text-xs text-white/30 py-4 text-center">
              No subjects yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
