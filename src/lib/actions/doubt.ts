"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/get-sessions";

export interface CreateDoubtInput {
  title: string;
  body: string;
  subjectId?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export async function createDoubt(input: CreateDoubtInput) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!input.title.trim() || !input.body.trim()) {
    return { success: false, error: "Title and body are required" };
  }

  try {
    const doubt = await prisma.doubt.create({
      data: {
        title: input.title.trim(),
        body: input.body.trim(),
        difficulty: input.difficulty,
        userId: session.user.id,
        subjectId: input.subjectId || null,
      },
    });

    return { success: true, doubtId: doubt.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create doubt";
    return { success: false, error: message };
  }
}

export interface UpdateDoubtInput {
  title: string;
  body: string;
  subjectId?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export async function updateDoubt(doubtId: string, input: UpdateDoubtInput) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!input.title.trim() || !input.body.trim()) {
    return { success: false, error: "Title and body are required" };
  }

  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      select: { userId: true },
    });

    if (!doubt) {
      return { success: false, error: "Doubt not found" };
    }

    if (doubt.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.doubt.update({
      where: { id: doubtId },
      data: {
        title: input.title.trim(),
        body: input.body.trim(),
        difficulty: input.difficulty,
        subjectId: input.subjectId || null,
      },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update doubt";
    return { success: false, error: message };
  }
}

export async function getMyDoubts(
  status?: "OPEN" | "UNDER_REVIEW" | "RESOLVED",
) {
  const session = await getServerSession();
  if (!session?.user) {
    return [];
  }

  try {
    const doubts = await prisma.doubt.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status } : {}),
      },
      include: {
        subject: { select: { name: true } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doubts;
  } catch (error) {
    console.error("Failed to fetch doubts:", error);
    return [];
  }
}

export async function getDoubtById(doubtId: string) {
  const session = await getServerSession();

  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      include: {
        user: { select: { id: true, name: true, role: true } },
        subject: { select: { name: true } },
        responses: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!doubt) {
      return { success: false, error: "Doubt not found" };
    }

    // Anyone logged in can view any doubt
    return { success: true, doubt, currentUserId: session?.user?.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch doubt";
    return { success: false, error: message };
  }
}

export async function updateDoubtStatus(
  doubtId: string,
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED",
) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      select: { userId: true },
    });

    if (!doubt) {
      return { success: false, error: "Doubt not found" };
    }

    // Only owner or teacher can update status
    if (
      doubt.userId !== session.user.id &&
      session.user.role !== "TEACHER"
    ) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.doubt.update({
      where: { id: doubtId },
      data: { status },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update doubt";
    return { success: false, error: message };
  }
}

export async function deleteDoubt(doubtId: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
      select: { userId: true },
    });

    if (!doubt) {
      return { success: false, error: "Doubt not found" };
    }

    // Only owner can delete
    if (doubt.userId !== session.user.id) {
      return { success: false, error: "Not authorized" };
    }

    await prisma.doubt.delete({
      where: { id: doubtId },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete doubt";
    return { success: false, error: message };
  }
}

export async function getDashboardStats() {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }

  const isStudent = session.user.role === "STUDENT";

  try {
    const where = isStudent ? { userId: session.user.id } : {};

    const [total, open, resolved, responses] = await Promise.all([
      prisma.doubt.count({ where }),
      prisma.doubt.count({ where: { ...where, status: "OPEN" } }),
      prisma.doubt.count({ where: { ...where, status: "RESOLVED" } }),
      prisma.response.count({
        where: isStudent
          ? { doubt: { userId: session.user.id }, source: "AI" }
          : { source: "AI" },
      }),
    ]);

    return { total, open, resolved, aiAnswers: responses };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return { total: 0, open: 0, resolved: 0, aiAnswers: 0 };
  }
}

export async function getRecentDoubts(limit = 10) {
  const session = await getServerSession();

  try {
    const doubts = await prisma.doubt.findMany({
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
        subject: { select: { name: true } },
        responses: {
          where: { source: "AI" },
          take: 1,
          select: { content: true },
        },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doubts.map((d) => ({
      id: d.id,
      title: d.title,
      body: d.body,
      subject: d.subject?.name || "General",
      difficulty: d.difficulty,
      status: d.status,
      createdAt: d.createdAt,
      aiAnswer: d.responses[0]?.content || null,
      studentName: d.user.name,
      responseCount: d._count.responses,
    }));
  } catch (error) {
    console.error("Failed to fetch recent doubts:", error);
    return [];
  }
}
