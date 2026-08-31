import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButton } from "@/components/sign-in-button";
import { isSafeCallback } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const next = isSafeCallback(callbackUrl) ? callbackUrl : "/";

  if (session?.user) {
    redirect(next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-4xl">Sign in</h1>
      <p className="mt-4 text-[var(--muted)]">
        Google sign-in is only required to mark Played and see My Courses.
        Anyone can search the US catalog without an account.
      </p>
      <div className="mt-8 flex justify-center">
        <SignInButton
          callbackUrl={next}
          label="Continue with Google"
          variant="solid"
        />
      </div>
    </div>
  );
}
