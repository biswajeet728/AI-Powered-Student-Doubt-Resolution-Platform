"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import Link from "next/link";

interface DashboardUserMenuProps {
  user: {
    name: string;
    role: string;
  };
}

export default function DashboardUserMenu({ user }: DashboardUserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-mono text-sm text-white hover:bg-white/15 transition-colors">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-black">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 bg-[#2a2826] border-white/10"
      >
        <div className="px-2 py-1.5">
          <p className="font-mono text-sm font-medium text-white">
            {user.name}
          </p>
          <p className="font-mono text-xs text-white/50">{user.role}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <Link href="/profile">
          <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
            <HiOutlineUser className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        {user.role === "STUDENT" && (
          <Link href="/my-doubts">
            <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
              <HiOutlineAcademicCap className="mr-2 h-4 w-4" />
              My Doubts
            </DropdownMenuItem>
          </Link>
        )}
        {user.role === "TEACHER" && (
          <Link href="/teacher/review">
            <DropdownMenuItem className="font-mono text-white focus:bg-white/10 focus:text-white cursor-pointer">
              <HiOutlineAcademicCap className="mr-2 h-4 w-4" />
              Review
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
  );
}
