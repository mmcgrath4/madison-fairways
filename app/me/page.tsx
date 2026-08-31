import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";
import { getCoursesByIds } from "@/lib/courses";
import { courseMeta, locationLabel } from "@/lib/format";
import { listPlayedCourses } from "@/lib/played";

export const metadata: Metadata = {
  title: "My Courses",
};

export default async function MyCoursesPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-4xl">My Courses</h1>
        <p className="mt-4 text-[var(--muted)]">
          Sign in to see the US courses you have marked as played. The catalog
          stays public without an account.
        </p>
        <div className="mt-6 flex justify-center">
          <SignInButton
            callbackUrl="/me"
            label="Sign in with Google"
            variant="solid"
          />
        </div>
      </div>
    );
  }

  const played = await listPlayedCourses(session.user.id);

  if (played.unavailable) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl">My Courses</h1>
        <p className="mt-4 text-[var(--muted)]">
          You are signed in as {session.user.email ?? session.user.name}. Played
          flags are stored in Postgres — set <code>DATABASE_URL</code> and run{" "}
          <code>npx prisma migrate deploy</code>.
        </p>
      </div>
    );
  }

  const courses = getCoursesByIds(played.rows.map((row) => row.courseId));
  const playedAt = new Map(
    played.rows.map((row) => [row.courseId, row.playedAt]),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--clay-dark)]">
        {session.user.name ?? session.user.email}
      </p>
      <h1 className="mt-2 font-display text-4xl">My Courses</h1>
      <p className="mt-3 text-[var(--muted)]">
        {courses.length} played. Ranking these with pairwise insert is Week 2 —
        this list is just the bag of courses you have actually walked.
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[var(--line)] px-4 py-10 text-center text-[var(--muted)]">
          Nothing marked yet.{" "}
          <Link href="/" className="text-[var(--clay-dark)] hover:underline">
            Search a course
          </Link>{" "}
          and tap Played after a round.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {courses.map((course) => {
            const at = playedAt.get(course.id);
            return (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.id}`}
                  className="block rounded-2xl border border-[var(--line)] bg-white/80 p-4 hover:border-[var(--clay)]"
                >
                  <h2 className="font-display text-xl">{course.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {locationLabel(course)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink)]/80">
                    {courseMeta(course)}
                    {at
                      ? ` · Marked ${at.toLocaleDateString("en-US")}`
                      : null}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
