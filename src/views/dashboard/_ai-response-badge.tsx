"use client";

import { useState, useEffect } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import { isAutoApproved, getAutoApproveTimeRemaining } from "@/lib/config/ai";

interface AIResponseBadgeProps {
  approved: boolean;
  disapproved: boolean;
  createdAt: Date;
}

export default function AIResponseBadge({
  approved,
  disapproved,
  createdAt,
}: AIResponseBadgeProps) {
  const [autoApproved, setAutoApproved] = useState(() =>
    isAutoApproved(createdAt),
  );
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getAutoApproveTimeRemaining(createdAt),
  );

  // Update auto-approve status in real-time
  useEffect(() => {
    if (approved || disapproved || autoApproved) return;

    const interval = setInterval(() => {
      if (isAutoApproved(createdAt)) {
        setAutoApproved(true);
        setTimeRemaining("auto-approved");
        clearInterval(interval);
      } else {
        setTimeRemaining(getAutoApproveTimeRemaining(createdAt));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [approved, disapproved, autoApproved, createdAt]);

  // Disapproved
  if (disapproved) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-500/15 px-1.5 py-0.5 font-mono text-[10px] text-red-400">
        <HiOutlineXCircle className="h-2.5 w-2.5" />
        Disapproved
      </span>
    );
  }

  // Approved (manually or auto)
  if (approved || autoApproved) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-1.5 py-0.5 font-mono text-[10px] text-green-400">
        <HiOutlineCheckCircle className="h-2.5 w-2.5" />
        {autoApproved ? "Auto-Approved" : "Verified"}
      </span>
    );
  }

  // Pending — not yet auto-approved
  return (
    <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-400">
      <HiOutlineClock className="h-2.5 w-2.5" />
      {timeRemaining}
    </span>
  );
}
