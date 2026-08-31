import "server-only";

import catalog from "@/data/courses.json";
import { stateCodeFromQuery, stateName } from "@/lib/us-states";

export type CourseAccess = "public" | "private" | "unknown";

export type Course = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  holes?: number;
  par?: number;
  access: CourseAccess;
  kind?: string;
  website?: string;
  yearBuilt?: number;
};

export const PAGE_SIZE = 24;

type CatalogFile = {
  attribution: string;
  courses: Course[];
};

const data = catalog as CatalogFile;
const courses: Course[] = data.courses;
const byId = new Map(courses.map((course) => [course.id, course]));

export const courseCount = courses.length;
export const catalogAttribution = data.attribution;

export function getCourse(id: string): Course | undefined {
  return byId.get(id);
}

export function getCoursesByIds(ids: string[]): Course[] {
  return ids
    .map((id) => byId.get(id))
    .filter((course): course is Course => Boolean(course));
}

export type CourseSearchInput = {
  q?: string;
  access?: string;
  state?: string;
  page?: number;
};

export type CourseSearchResult = {
  results: Course[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function normalizeAccess(value: string | undefined): CourseAccess | "all" {
  if (value === "public" || value === "private") return value;
  return "all";
}

function haystack(course: Course): string {
  const parts = [
    course.name,
    course.city,
    course.state,
    stateName(course.state),
    course.kind,
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function searchCourses(input: CourseSearchInput): CourseSearchResult {
  const access = normalizeAccess(input.access);
  const stateFilter = (input.state ?? "").trim().toUpperCase();
  const query = (input.q ?? "").trim().toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);
  const pageSize = PAGE_SIZE;
  const page = Math.max(1, input.page ?? 1);

  const matched = courses.filter((course) => {
    if (access !== "all" && course.access !== access) return false;
    if (stateFilter && course.state !== stateFilter) return false;
    if (!tokens.length) return true;

    const text = haystack(course);
    return tokens.every((token) => {
      const asState = stateCodeFromQuery(token);
      if (asState && course.state === asState) return true;
      return text.includes(token);
    });
  });

  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    results: matched.slice(start, start + pageSize),
    total: matched.length,
    page: safePage,
    pageSize,
    pageCount,
  };
}
