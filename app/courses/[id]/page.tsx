import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { PlayedButton } from "@/components/played-button";
import { SignInButton } from "@/components/sign-in-button";
import { getCourse } from "@/lib/courses";
import { accessLabel, courseMeta, locationLabel } from "@/lib/format";
import { getPlayedCourseIds } from "@/lib/played";
import { getPrisma } from "@/lib/prisma";
import { stateName } from "@/lib/us-states";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) return { title: "Course" };
  return { title: course.name };
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  const session = await auth();
  const played = session?.user?.id
    ? (await getPlayedCourseIds(session.user.id)).has(course.id)
    : false;
  const databaseReady = Boolean(getPrisma());
  const returnTo = `/courses/${course.id}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-[var(--muted)] hover:text-[var(--clay-dark)]"
      >
        ← All courses
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-[var(--clay-dark)]">
        {course.state ? (stateName(course.state) ?? course.state) : "United States"}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
        {course.name}
      </h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{locationLabel(course)}</p>
      <p className="mt-2 text-[var(--ink)]/80">{courseMeta(course)}</p>

      <dl className="mt-8 grid gap-4 rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Access
          </dt>
          <dd className="mt-1">{accessLabel(course.access, course.kind)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Holes
          </dt>
          <dd className="mt-1">{course.holes ? course.holes : "Unlisted"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Par
          </dt>
          <dd className="mt-1">{course.par ?? "Unlisted"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Opened
          </dt>
          <dd className="mt-1">{course.yearBuilt ?? "Unlisted"}</dd>
        </div>
      </dl>

      {course.website ? (
        <p className="mt-4 text-sm">
          <a
            href={course.website}
            className="text-[var(--clay-dark)] underline-offset-2 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            Course website
          </a>
        </p>
      ) : null}

      <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--ink)] px-5 py-6 text-[var(--paper)]">
        <h2 className="font-display text-2xl">Have you played it?</h2>
        <p className="mt-2 max-w-lg text-sm text-[var(--paper)]/70">
          Marking Played is how your list starts. Week 2 will insert each new
          course into an ordered ranking with pairwise questions — not stars.
        </p>
        <div className="mt-5">
          {!session?.user ? (
            <SignInButton
              callbackUrl={returnTo}
              label="Sign in to mark played"
              variant="solid"
            />
          ) : !databaseReady ? (
            <p className="text-sm text-[var(--clay-light)]">
              Played flags need a Postgres <code>DATABASE_URL</code>. Browse
              still works.
            </p>
          ) : (
            <PlayedButton
              courseId={course.id}
              played={played}
              returnTo={returnTo}
            />
          )}
        </div>
      </section>
    </div>
  );
}
