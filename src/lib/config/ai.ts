// ── AI Configuration ─────────────────────────────────────────────────
// Change `AUTO_APPROVE_AFTER_MS` to control when unapproved AI answers
// are treated as approved by default.
//
// For testing:  2 * 60 * 1000        (2 minutes)
// For production: 24 * 60 * 60 * 1000 (24 hours)

export const AI_CONFIG = {
  // Auto-approve unapproved AI responses after this time (ms)
  // AUTO_APPROVE_AFTER_MS: 24 * 60 * 60 * 1000, // 24 hours (change to 24h for prod)
  AUTO_APPROVE_AFTER_MS: 10 * 60 * 1000, // 10 minutes (for testing)

  // Whether to show full answer with warning badge for unapproved responses
  SHOW_FULL_UNAPPROVED: true,
} as const;

// ── Helper: Check if an AI response should be auto-approved ──────────
export function isAutoApproved(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() > AI_CONFIG.AUTO_APPROVE_AFTER_MS;
}

// ── Helper: Time remaining until auto-approve ────────────────────────
export function getAutoApproveTimeRemaining(createdAt: Date): string {
  const elapsed = Date.now() - createdAt.getTime();
  const remaining = AI_CONFIG.AUTO_APPROVE_AFTER_MS - elapsed;

  if (remaining <= 0) return "auto-approved";

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
