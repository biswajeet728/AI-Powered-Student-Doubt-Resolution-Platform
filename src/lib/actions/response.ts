"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-sessions";

// ── Create Teacher Response ──────────────────────────────────────────
export async function createTeacherResponse(doubtId: string, content: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return { success: false, error: "Only teachers can respond" };
  }

  if (!content.trim()) {
    return { success: false, error: "Response content is required" };
  }

  try {
    // Check doubt exists
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      select: { id: true, status: true },
    });

    if (!doubt) {
      return { success: false, error: "Doubt not found" };
    }

    // Create teacher response
    const response = await prisma.response.create({
      data: {
        content: content.trim(),
        source: "TEACHER",
        doubtId,
        userId: session.user.id,
      },
    });

    // Update doubt status to UNDER_REVIEW if it was OPEN
    if (doubt.status === "OPEN") {
      await prisma.doubt.update({
        where: { id: doubtId },
        data: { status: "UNDER_REVIEW" },
      });
    }

    return { success: true, responseId: response.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create response";
    return { success: false, error: message };
  }
}

// ── Approve AI Response ──────────────────────────────────────────────
export async function approveResponse(responseId: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return { success: false, error: "Only teachers can approve" };
  }

  try {
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      select: { id: true, doubtId: true, approved: true },
    });

    if (!response) {
      return { success: false, error: "Response not found" };
    }

    // Approve this response
    await prisma.response.update({
      where: { id: responseId },
      data: { approved: true },
    });

    // Update doubt status to RESOLVED
    await prisma.doubt.update({
      where: { id: response.doubtId },
      data: { status: "RESOLVED" },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to approve response";
    return { success: false, error: message };
  }
}

// ── Disapprove Response ──────────────────────────────────────────────
export async function disapproveResponse(responseId: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return { success: false, error: "Only teachers can disapprove" };
  }

  try {
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      select: { id: true, doubtId: true, content: true },
    });

    if (!response) {
      return { success: false, error: "Response not found" };
    }

    // Mark as disapproved so UI can detect the state
    await prisma.response.update({
      where: { id: responseId },
      data: {
        approved: false,
        content: `__DISAPPROVED__:${response.content}`,
      },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to disapprove response";
    return { success: false, error: message };
  }
}

// ── Update Teacher Response ──────────────────────────────────────────
export async function updateResponse(responseId: string, content: string) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return { success: false, error: "Only teachers can edit responses" };
  }

  if (!content.trim()) {
    return { success: false, error: "Response content is required" };
  }

  try {
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      select: { id: true, userId: true, source: true },
    });

    if (!response) {
      return { success: false, error: "Response not found" };
    }

    // Only the teacher who wrote it can edit
    if (response.userId !== session.user.id || response.source !== "TEACHER") {
      return { success: false, error: "Not authorized" };
    }

    await prisma.response.update({
      where: { id: responseId },
      data: { content: content.trim() },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update response";
    return { success: false, error: message };
  }
}

// ── Get Doubts for Review Queue ──────────────────────────────────────
export async function getDoubtsForReview(
  status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED",
) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return [];
  }

  try {
    const where: Record<string, unknown> = {
      ...(status ? { status } : {}),
    };

    const doubts = await prisma.doubt.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        subject: { select: { name: true } },
        responses: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doubts.map((d) => ({
      id: d.id,
      title: d.title,
      body: d.body,
      status: d.status,
      difficulty: d.difficulty,
      subject: d.subject?.name || "General",
      createdAt: d.createdAt,
      studentName: d.user.name,
      responseCount: d._count.responses,
      responses: d.responses.map((r) => ({
        id: r.id,
        content: r.content,
        source: r.source,
        approved: r.approved,
        createdAt: r.createdAt,
        userName: r.user?.name || "AI",
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch review doubts:", error);
    return [];
  }
}

// ── Get Teacher Stats ────────────────────────────────────────────────
export async function getTeacherStats() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "TEACHER") {
    return null;
  }

  try {
    const [pending, reviewed, overridden] = await Promise.all([
      prisma.doubt.count({
        where: { status: { in: ["OPEN", "UNDER_REVIEW"] } },
      }),
      prisma.response.count({
        where: {
          source: "TEACHER",
          userId: session.user.id,
          approved: true,
        },
      }),
      prisma.response.count({
        where: {
          source: "TEACHER",
          userId: session.user.id,
        },
      }),
    ]);

    const totalResponses = await prisma.response.count({
      where: { source: "AI" },
    });

    const approvedAI = await prisma.response.count({
      where: { source: "AI", approved: true },
    });

    return {
      pending,
      reviewed,
      overridden,
      totalAI: totalResponses,
      approvedAI,
    };
  } catch (error) {
    console.error("Failed to fetch teacher stats:", error);
    return { pending: 0, reviewed: 0, overridden: 0, totalAI: 0, approvedAI: 0 };
  }
}
