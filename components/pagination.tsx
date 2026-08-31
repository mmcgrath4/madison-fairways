import Link from "next/link";

function hrefFor(page: number, q: string, access: string, state: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (access && access !== "all") params.set("access", access);
  if (state) params.set("state", state);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function Pagination({
  page,
  pageCount,
  q,
  access,
  state,
}: {
  page: number;
  pageCount: number;
  q: string;
  access: string;
  state: string;
}) {
  if (pageCount <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < pageCount ? page + 1 : null;

  return (
    <nav
      className="mt-8 flex items-center justify-between text-sm"
      aria-label="Pagination"
    >
      {prev ? (
        <Link
          href={hrefFor(prev, q, access, state)}
          className="rounded-full border border-[var(--line)] px-4 py-2 hover:border-[var(--clay)]"
        >
          Previous
        </Link>
      ) : (
        <span />
      )}
      <p className="text-[var(--muted)]">
        Page {page} of {pageCount}
      </p>
      {next ? (
        <Link
          href={hrefFor(next, q, access, state)}
          className="rounded-full border border-[var(--line)] px-4 py-2 hover:border-[var(--clay)]"
        >
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
