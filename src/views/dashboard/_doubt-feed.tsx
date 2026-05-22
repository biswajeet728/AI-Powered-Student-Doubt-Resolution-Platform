"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePencilSquare,
  HiOutlineChevronRight,
  HiOutlineTag,
  HiOutlineBookOpen,
  HiOutlineXMark,
} from "react-icons/hi2";
import DoubtFeedCard from "./_doubt-feed-card";
import { DUMMY_TAGS } from "./_dashboard-data";

interface RecentDoubt {
  id: string;
  title: string;
  body: string;
  subject: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: Date;
  aiResponseId: string | null;
  aiAnswer: string | null;
  aiApproved: boolean;
  aiResponseCreatedAt: Date | null;
  studentName: string;
  responseCount: number;
}

interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  aiAnswers: number;
  pendingReview?: number;
}

interface DoubtFeedProps {
  isStudent: boolean;
  showStats?: boolean;
  showFilters?: boolean;
  doubts: RecentDoubt[];
  stats?: DashboardStats;
  selectedSubject?: string | null;
  onClearSubject?: () => void;
}

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "UNDER_REVIEW", label: "Reviewing" },
  { key: "RESOLVED", label: "Resolved" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function DoubtFeed({
  isStudent,
  showStats,
  doubts,
  stats,
  selectedSubject,
  onClearSubject,
}: DoubtFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");

  // Set to true to test scroll with 10 dummy cards, false for real data
  const TEST_MODE = false;

  const allDoubts: RecentDoubt[] = TEST_MODE
    ? Array.from({ length: 10 }, (_, i) => ({
        id: `test-${i + 1}`,
        title: `Test Doubt ${i + 1}: ${
          [
            "Why does water expand when it freezes?",
            "Explain dynamic programming with memoization",
            "What is Rayleigh scattering?",
            "Difference between mitosis and meiosis",
            "How does recursion work in JavaScript?",
            "What is the time complexity of quicksort?",
            "Explain Newton's third law",
            "How do DNS lookups work?",
            "What is the difference between TCP and UDP?",
            "Explain the concept of closures in programming",
          ][i]
        }`,
        body: `This is a test doubt body for card ${i + 1}. It contains some sample text to test the scroll behavior on both mobile and desktop views. This line should be long enough to show line clamping.`,
        subject: ["Physics", "Computer Science", "Biology", "Mathematics"][
          i % 4
        ],
        difficulty: (["EASY", "MEDIUM", "HARD"] as const)[i % 3],
        status: (["OPEN", "OPEN", "UNDER_REVIEW", "RESOLVED", "OPEN"] as const)[
          i % 5
        ],
        createdAt: new Date(Date.now() - i * 3600000),
        aiResponseId: i % 3 !== 2 ? `ai-${i + 1}` : null,
        aiAnswer:
          i % 3 !== 2
            ? `This is a sample AI-generated answer for doubt ${i + 1}. It explains the concept in detail with examples and code snippets. The answer is formatted using **markdown** for better readability.`
            : null,
        aiApproved: i % 3 === 0,
        aiResponseCreatedAt:
          i % 3 !== 2 ? new Date(Date.now() - (i * 3600000 - 10000)) : null,
        studentName: [
          "Rohan Mehta",
          "Ananya Shah",
          "Preet Kapoor",
          "Arjun Nair",
        ][i % 4],
        responseCount: i % 3 !== 2 ? 1 : 0,
      }))
    : doubts;

  const filteredDoubts =
    activeFilter === "ALL"
      ? allDoubts
      : allDoubts.filter((d) => d.status === activeFilter);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row — mobile/tablet only */}
      {showStats && stats && (
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              icon: <HiOutlineSparkles className="h-4 w-4 text-amber-400" />,
              bg: "bg-amber-500/15",
              label: "Total",
              value: String(stats.total),
            },
            {
              icon: <HiOutlineClock className="h-4 w-4 text-blue-400" />,
              bg: "bg-blue-500/15",
              label: "Open",
              value: String(stats.open),
            },
            {
              icon: <HiOutlineCheckCircle className="h-4 w-4 text-green-400" />,
              bg: "bg-green-500/15",
              label: "Resolved",
              value: String(stats.resolved),
            },
            {
              icon: (
                <HiOutlineChatBubbleLeftRight className="h-4 w-4 text-purple-400" />
              ),
              bg: "bg-purple-500/15",
              label: "AI Answers",
              value: String(stats.aiAnswers),
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm"
            >
              <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  {stat.icon}
                </div>
                <p className="font-mono text-lg font-bold text-white leading-none">
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] text-white/40">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Post doubt form — students only */}
      {isStudent && (
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlinePencilSquare className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-base font-semibold text-white">
                Ask a new doubt
              </span>
              <small
                className="font-mono text-xs text-white/30 ml-auto"
                title="Keyboard Shortcut"
              >
                ALT + Q to Post it Quickly
              </small>
            </div>
            <Link href="/dashboard/ask">
              <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white/30 hover:border-amber-500/30 hover:bg-white/8 transition-colors">
                What&apos;s your doubt? Be specific...
              </div>
            </Link>
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="font-mono text-xs text-white/30">
                AI will answer instantly after posting
              </span>
              <Link href="/dashboard/ask">
                <Button
                  size="sm"
                  className="font-mono text-xs bg-amber-500 text-black hover:bg-amber-400 py-4 cursor-pointer"
                >
                  <HiOutlineSparkles className="mr-1.5 h-3.5 w-3.5" />
                  Post &amp; Get AI Answer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teacher pending banner */}
      {!isStudent && (
        <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <p className="font-mono text-sm font-semibold text-white">
                  {stats?.pendingReview ?? stats?.open ?? 0} doubts need your
                  review
                </p>
                <p className="font-mono text-xs text-white/40">
                  AI has answered — approve or override
                </p>
              </div>
            </div>
            <Link href="/teacher/review">
              <Button
                size="sm"
                className="font-mono text-xs bg-amber-500 text-black hover:bg-amber-400 cursor-pointer"
              >
                Review Now
                <HiOutlineChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Feed header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold text-white">
            {selectedSubject
              ? selectedSubject
              : isStudent
                ? "Recent Doubts"
                : "All Doubts"}
            {activeFilter !== "ALL" && (
              <span className="ml-2 text-white/30 font-normal">
                ({filteredDoubts.length})
              </span>
            )}
          </h2>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-3 py-1 font-mono text-xs transition-colors cursor-pointer ${
                  activeFilter === f.key
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {selectedSubject && onClearSubject && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-400">
              <HiOutlineBookOpen className="h-3 w-3" />
              {selectedSubject}
              <button
                onClick={onClearSubject}
                className="ml-1 rounded-full p-0.5 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <HiOutlineXMark className="h-3 w-3" />
              </button>
            </span>
            <span className="font-mono text-xs text-white/30">
              {doubts.length} doubt{doubts.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Doubt cards */}
      {filteredDoubts.length === 0 ? (
        <Card className="border-white/10 bg-[#2a2826]/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HiOutlineSparkles className="mb-3 h-10 w-10 text-white/15" />
            <p className="font-mono text-sm text-white/40">
              {activeFilter === "ALL"
                ? "No doubts posted yet"
                : `No ${activeFilter.toLowerCase().replace("_", " ")} doubts`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredDoubts.map((doubt) => (
            <DoubtFeedCard
              key={doubt.id}
              doubt={{
                id: doubt.id,
                title: doubt.title,
                body: doubt.body,
                subject: doubt.subject,
                tags: [],
                difficulty: doubt.difficulty,
                status: doubt.status,
                createdAt: formatTimeAgo(doubt.createdAt),
                createdAtDate: doubt.aiResponseCreatedAt
                  ? new Date(doubt.aiResponseCreatedAt)
                  : new Date(doubt.createdAt),
                aiResponseId: doubt.aiResponseId,
                aiAnswer: doubt.aiAnswer,
                aiApproved: doubt.aiApproved,
                studentName: doubt.studentName,
              }}
              isTeacher={!isStudent}
            />
          ))}
        </div>
      )}

      {/* View all */}
      <Link href="/my-doubts" className="block">
        <Button
          variant="ghost"
          className="w-full font-mono text-xs text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          View all doubts
          <HiOutlineChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
