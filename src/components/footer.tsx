import { HiOutlineAcademicCap } from "react-icons/hi2";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#2a2826]/50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="h-5 w-5 text-amber-400" />
            <span className="font-mono text-sm font-semibold text-white">
              Doubt-Flow
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs text-white/40">
            &copy; {new Date().getFullYear()} Doubt-Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
