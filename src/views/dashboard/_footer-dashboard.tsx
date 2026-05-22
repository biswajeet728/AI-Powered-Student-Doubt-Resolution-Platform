import { HiOutlineAcademicCap } from "react-icons/hi2";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function FooterDashboard() {
  return (
    <footer className="border-t border-white/10 bg-[#2a2826]/50 py-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Logo + Name */}
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-xs font-semibold text-white">
              Doubt-Flow
            </span>
            <span className="font-mono text-[10px] text-white/20">|</span>
            <span className="font-mono text-[10px] text-white/40">
              Built by Biswajeet Dash
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/biswajeet728"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[11px] text-white/40 hover:text-white transition-colors"
            >
              <FiGithub className="h-3 w-3" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/dash-biswajeet408/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[11px] text-white/40 hover:text-white transition-colors"
            >
              <FiLinkedin className="h-3 w-3" />
              LinkedIn
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs text-white/30">
            &copy; {new Date().getFullYear()} Doubt-Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
