import { auth } from "@/auth";
import { CourseCard } from "@/components/course-card";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { courseCount, searchCourses } from "@/lib/courses";
import { getPlayedCourseIds } from "@/lib/played";

type Search = {
  q?: string;
  access?: string;
  state?: string;
  page?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const access = params.access ?? "all";
  const state = params.state ?? "";
  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  const session = await auth();
  const playedIds = session?.user?.id
    ? await getPlayedCourseIds(session.user.id)
    : new Set<string>();

  const results = searchCourses({ q, access, state, page });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <section className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--clay-dark)]">
          Week 1 · Catalog
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
          Rank the courses you have actually played.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
          Madison Fairways is Beli for golf: an ordered list of US courses from
          your own rounds, not a 5-star average. This week is search, sign-in,
          and marking Played. Pairwise insert ranking is Week 2.
        </p>
      </section>

      <div className="mt-8">
        <SearchForm q={q} access={access} state={state} />
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-2xl">Courses</h2>
          <p className="text-sm text-[var(--muted)]">
            {results.total.toLocaleString()} match
            {results.total === 1 ? "" : "es"} · {courseCount.toLocaleString()}{" "}
            US courses in the seed
          </p>
        </div>

        {results.results.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[var(--line)] px-4 py-10 text-center text-[var(--muted)]">
            No courses matched. Try a city, a state abbreviation, or a shorter
            name.
          </p>
        ) : (
          <ul className="mt-5 grid gap-3">
            {results.results.map((course) => (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  played={playedIds.has(course.id)}
                />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={results.page}
          pageCount={results.pageCount}
          q={q}
          access={access}
          state={state}
        />
      </section>
    </div>
  );
}
