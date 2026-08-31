import { US_STATES } from "@/lib/us-states";

export function SearchForm({
  q,
  access,
  state,
}: {
  q: string;
  access: string;
  state: string;
}) {
  return (
    <form
      action="/"
      method="get"
      className="rounded-2xl border border-[var(--line)] bg-white/70 p-4 shadow-[0_10px_40px_-24px_rgba(20,18,16,0.45)] sm:p-5"
    >
      <label htmlFor="q" className="font-display text-lg text-[var(--ink)]">
        Find a course you have played
      </label>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Search by name, city, or state. Catalog is public — no login to browse.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Pebble Beach, Madison, Bethpage…"
          className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-[var(--ink)] outline-none ring-[var(--clay)] placeholder:text-[var(--muted)] focus:ring-2"
        />
        <select
          name="state"
          defaultValue={state}
          aria-label="Filter by state"
          className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-[var(--ink)] outline-none ring-[var(--clay)] focus:ring-2 sm:w-44"
        >
          <option value="">All states</option>
          {US_STATES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] hover:bg-black"
        >
          Search
        </button>
      </div>
      <fieldset className="mt-4">
        <legend className="sr-only">Access</legend>
        <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--paper)] p-1 text-sm">
          {[
            { value: "all", label: "All" },
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ].map((option) => {
            const checked =
              option.value === "all"
                ? access !== "public" && access !== "private"
                : access === option.value;
            return (
              <label
                key={option.value}
                className="cursor-pointer rounded-full px-3 py-1.5 text-[var(--muted)] hover:text-[var(--ink)] has-[:checked]:bg-[var(--clay)] has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="access"
                  value={option.value}
                  defaultChecked={checked}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </form>
  );
}
