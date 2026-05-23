"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HiOutlineAcademicCap,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useSession, signOut } from "@/lib/auth-client";

export default function HomeHeader() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const isTeacher = (session?.user as any)?.role === "TEACHER";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#2a2826]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HiOutlineAcademicCap className="h-6 w-6 text-amber-400" />
          <span className="font-mono text-lg font-bold text-white">
            Doubt-Flow
          </span>
        </Link>

        {/* Auth Section */}
        <nav className="flex items-center gap-3">
          {isPending ? (
            // Loading skeleton
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 animate-pulse rounded-md bg-white/10" />
              <div className="h-9 w-24 animate-pulse rounded-md bg-white/10" />
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="font-mono text-white hover:bg-white/10 hover:text-white cursor-pointer inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm border border-white/20 bg-white/5">
                <HiOutlineUser className="h-4 w-4" />
                {session.user.name}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#2a2826] border-white"
              >
                <Link href="/profile">
                  <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
                    <HiOutlineUser className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                {isTeacher && (
                  <Link href="/teacher/review">
                    <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
                      <HiOutlineAcademicCap className="mr-2 h-4 w-4" />
                      Review Doubts
                    </DropdownMenuItem>
                  </Link>
                )}
                {!isTeacher && (
                  <Link href="/my-doubts">
                    <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
                      <HiOutlineAcademicCap className="mr-2 h-4 w-4" />
                      My Doubts
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="font-mono text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                >
                  <HiOutlineArrowRightOnRectangle className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white py-4 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="font-mono bg-amber-500 text-black hover:bg-amber-400 py-4 cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
