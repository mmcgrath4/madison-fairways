import Link from "next/link";

import type { Course } from "@/lib/courses";
import { courseMeta, locationLabel } from "@/lib/format";

export function CourseCard({
  course,
  played,
}: {
  course: Course;
  played?: boolean;
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block rounded-2xl border border-[var(--line)] bg-white/80 p-4 transition hover:border-[var(--clay)] hover:shadow-[0_12px_32px_-20px_rgba(196,92,38,0.55)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl leading-snug text-[var(--ink)] group-hover:text-[var(--clay-dark)]">
            {course.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{locationLabel(course)}</p>
        </div>
        {played ? (
          <span className="shrink-0 rounded-full bg-[var(--fairway)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--paper)]">
            Played
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-[var(--ink)]/80">{courseMeta(course)}</p>
    </Link>
  );
}
