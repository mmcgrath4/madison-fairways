import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Course not in the bag</h1>
      <p className="mt-3 text-[var(--muted)]">
        That course is not in the current US seed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-[var(--clay-dark)] hover:underline"
      >
        Back to search
      </Link>
    </div>
  );
}
