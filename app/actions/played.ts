"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isSafeCallback } from "@/lib/format";
import { getPrisma } from "@/lib/prisma";

export async function togglePlayed(courseId: string, returnTo?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    const callback = isSafeCallback(returnTo) ? returnTo : `/courses/${courseId}`;
    redirect(`/signin?callbackUrl=${encodeURIComponent(callback)}`);
  }

  const prisma = getPrisma();
  if (!prisma) {
    throw new Error(
      "Played flags need DATABASE_URL. Add a Postgres database, then run prisma migrate deploy.",
    );
  }

  const existing = await prisma.playedCourse.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (existing) {
    await prisma.playedCourse.delete({ where: { id: existing.id } });
  } else {
    await prisma.playedCourse.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/me");
  revalidatePath(`/courses/${courseId}`);
}
