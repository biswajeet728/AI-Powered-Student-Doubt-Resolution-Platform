"use client";

import { useState } from "react";
import { HiOutlineBookOpen, HiOutlineChevronDown } from "react-icons/hi2";
import type { SubjectWithCount } from "@/lib/actions/subject";

interface SubjectFilterProps {
  subjects: SubjectWithCount[];
}

export default function SubjectFilter({ subjects }: SubjectFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 10;
  const hasMore = subjects.length > VISIBLE_COUNT;
  const visibleSubjects = showAll ? subjects : subjects.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-col gap-1">
      {/* All subjects */}
      <button className="flex items-center justify-between rounded-lg px-2.5 py-2 font-mono text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 cursor-pointer">
        <span>All subjects</span>
        <span className="text-amber-400/60">
          {subjects.reduce((a, s) => a + s.doubtCount, 0)}
        </span>
      </button>

      {visibleSubjects.map((subject) => (
        <button
          key={subject.id}
          className="flex items-center justify-between rounded-lg px-2.5 py-2 font-mono text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <span>{subject.name}</span>
          <span className="text-white/20">{subject.doubtCount}</span>
        </button>
      ))}

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-mono text-xs text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/5 transition-colors cursor-pointer"
        >
          Show {subjects.length - VISIBLE_COUNT} more
          <HiOutlineChevronDown className="h-3 w-3" />
        </button>
      )}

      {hasMore && showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-mono text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          Show less
        </button>
      )}
    </div>
  );
}
