"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
  }, []);

  const startProgress = useCallback(() => {
    cleanup();
    setProgress(0);
    setIsLoading(true);

    // Quick initial jump to feel responsive
    startTimeoutRef.current = setTimeout(() => {
      setProgress(30);
    }, 50);

    // Gradually increase
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);
  }, [cleanup]);

  const completeProgress = useCallback(() => {
    cleanup();
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, [cleanup]);

  // Detect internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, target blank, downloads
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download")
      ) {
        return;
      }

      // Skip if navigating to the same page
      const currentUrl =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      if (href === currentUrl) return;

      startProgress();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, searchParams, startProgress]);

  // Complete when route changes
  useEffect(() => {
    if (isLoading) {
      completeProgress();
    }
    // We intentionally only depend on pathname and searchParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  // Safety timeout — auto-complete after 5s to avoid stuck bar
  useEffect(() => {
    if (!isLoading) return;
    const safety = setTimeout(() => completeProgress(), 5000);
    return () => clearTimeout(safety);
  }, [isLoading, completeProgress]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-0.75">
      <div
        className="h-full transition-all ease-out rounded-r-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)",
          transitionDuration: progress === 100 ? "200ms" : "100ms",
          boxShadow:
            "0 0 10px rgba(245, 158, 11, 0.6), 0 0 5px rgba(245, 158, 11, 0.4)",
        }}
      />
    </div>
  );
}
