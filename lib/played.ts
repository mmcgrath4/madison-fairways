import { getPrisma } from "@/lib/prisma";

export async function getPlayedCourseIds(userId: string): Promise<Set<string>> {
  const prisma = getPrisma();
  if (!prisma) return new Set();

  const rows = await prisma.playedCourse.findMany({
    where: { userId },
    select: { courseId: true },
  });
  return new Set(rows.map((row) => row.courseId));
}

export async function listPlayedCourses(userId: string) {
  const prisma = getPrisma();
  if (!prisma) return { unavailable: true as const, rows: [] };

  const rows = await prisma.playedCourse.findMany({
    where: { userId },
    orderBy: { playedAt: "desc" },
  });

  return { unavailable: false as const, rows };
}
