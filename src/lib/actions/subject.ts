"use server";

import prisma from "@/lib/prisma";

export interface SubjectWithCount {
  id: string;
  name: string;
  description: string | null;
  doubtCount: number;
}

export async function getSubjects(): Promise<SubjectWithCount[]> {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: { doubts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return subjects.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      doubtCount: s._count.doubts,
    }));
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return [];
  }
}
