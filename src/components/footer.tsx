import { HiOutlineAcademicCap } from "react-icons/hi2";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#2a2826]/50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo + Name */}
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="h-5 w-5 text-amber-400" />
            <span className="font-mono text-sm font-semibold text-white">
              Doubt-Flow
            </span>
            <span className="font-mono text-xs text-white/20">|</span>
            <span className="font-mono text-xs text-white/40">
              Built by Biswajeet Dash
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/biswajeet728"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              <FiGithub className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/dash-biswajeet408/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-white transition-colors"
            >
              <FiLinkedin className="h-3.5 w-3.5" />
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
