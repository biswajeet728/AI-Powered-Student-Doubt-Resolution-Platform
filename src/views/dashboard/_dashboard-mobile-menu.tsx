"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

interface DashboardMobileMenuProps {
  user: { name: string; role: string };
}

export default function DashboardMobileMenu({
  user,
}: DashboardMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isStudent = user.role === "STUDENT";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        {open ? (
          <HiOutlineXMark className="h-5 w-5" />
        ) : (
          <HiOutlineBars3 className="h-5 w-5" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 border-l border-white/10 bg-[#2a2826] p-6 shadow-2xl">
            {/* User Info */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-mono text-sm font-medium text-white">
                  {user.name}
                </p>
                <p className="font-mono text-xs text-white/50">{user.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-white transition-colors hover:bg-white/10"
              >
                <HiOutlineAcademicCap className="h-4 w-4 text-amber-400" />
                Dashboard
              </Link>
              <Link
                href="/my-doubts"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <HiOutlineBookOpen className="h-4 w-4" />
                My Doubts
              </Link>
              {user.role === "TEACHER" && (
                <Link
                  href="/teacher/review"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
                  Review
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <HiOutlineUser className="h-4 w-4" />
                Profile
              </Link>

              <div className="my-2 h-px bg-white/10" />

              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="justify-start font-mono text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <HiOutlineArrowRightOnRectangle className="mr-3 h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
