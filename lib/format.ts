import type { Course, CourseAccess } from "@/lib/courses";
import { stateName } from "@/lib/us-states";

export function locationLabel(course: Pick<Course, "city" | "state">): string {
  const city = course.city?.trim();
  const state = course.state?.trim();
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return stateName(state) ?? state;
  return "Location unlisted";
}

export function accessLabel(access: CourseAccess, kind?: string): string {
  if (kind) return kind;
  if (access === "public") return "Public";
  if (access === "private") return "Private";
  return "Access unlisted";
}

export function holesLabel(holes: number | undefined): string | null {
  if (!holes) return null;
  return `${holes} hole${holes === 1 ? "" : "s"}`;
}

export function courseMeta(course: Course): string {
  const parts = [
    holesLabel(course.holes),
    accessLabel(course.access, course.kind),
    course.par ? `Par ${course.par}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function isSafeCallback(path: string | undefined): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}
