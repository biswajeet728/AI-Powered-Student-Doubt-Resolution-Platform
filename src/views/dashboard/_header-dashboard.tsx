"use client";

import Link from "next/link";
import { useUser } from "@/lib/providers/user-context";
import DashboardUserMenu from "./_dashboard-user-menu";
import DashboardMobileMenu from "./_dashboard-mobile-menu";
import { HiOutlineAcademicCap } from "react-icons/hi2";

export default function HeaderDashboard() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#2a2826]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <HiOutlineAcademicCap className="h-6 w-6 text-amber-400" />
          <span className="font-mono text-lg font-bold text-white">
            Doubt-Flow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-white/10"
          >
            Dashboard
          </Link>
          {user.role === "STUDENT" && (
            <Link
              href="/my-doubts"
              className="rounded-lg px-4 py-2 font-mono text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              My Doubts
            </Link>
          )}
          {user.role === "TEACHER" && (
            <Link
              href="/teacher/review"
              className="rounded-lg px-4 py-2 font-mono text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              Review
            </Link>
          )}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <DashboardUserMenu user={{ name: user.name, role: user.role }} />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DashboardMobileMenu user={{ name: user.name, role: user.role }} />
        </div>
      </div>
    </header>
  );
}
