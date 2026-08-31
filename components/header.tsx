import Link from "next/link";

import { auth, signOut } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group min-w-0">
          <p className="font-display text-lg tracking-tight text-[var(--clay-light)] sm:text-xl">
            Madison Fairways
          </p>
          <p className="truncate text-[11px] uppercase tracking-[0.18em] text-[var(--paper)]/65">
            Beli for golf · United States
          </p>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-[var(--paper)]/80 hover:bg-white/10 hover:text-white"
          >
            Browse
          </Link>
          <Link
            href="/me"
            className="rounded-full px-3 py-1.5 text-[var(--paper)]/80 hover:bg-white/10 hover:text-white"
          >
            My Courses
          </Link>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 text-[var(--paper)]/80 hover:bg-white/10 hover:text-white"
              >
                Sign out
              </button>
            </form>
          ) : (
            <SignInButton />
          )}
        </nav>
      </div>
    </header>
  );
}
