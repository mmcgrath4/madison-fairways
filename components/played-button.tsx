"use client";

import { useTransition } from "react";

import { togglePlayed } from "@/app/actions/played";

export function PlayedButton({
  courseId,
  played,
  returnTo,
}: {
  courseId: string;
  played: boolean;
  returnTo: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void togglePlayed(courseId, returnTo);
        })
      }
      className={
        played
          ? "rounded-full bg-[var(--fairway)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] hover:bg-[#182f21] disabled:opacity-60"
          : "rounded-full bg-[var(--clay)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--clay-dark)] disabled:opacity-60"
      }
    >
      {pending ? "Saving…" : played ? "Played — tap to undo" : "Mark played"}
    </button>
  );
}
