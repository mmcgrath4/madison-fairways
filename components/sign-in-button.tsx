import { signIn } from "@/auth";
import { isSafeCallback } from "@/lib/format";

export function SignInButton({
  callbackUrl,
  label = "Sign in",
  variant = "header",
}: {
  callbackUrl?: string;
  label?: string;
  variant?: "header" | "solid";
}) {
  const redirectTo = isSafeCallback(callbackUrl) ? callbackUrl : "/";

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <button
        type="submit"
        className={
          variant === "solid"
            ? "inline-flex items-center justify-center rounded-full bg-[var(--clay)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--clay-dark)]"
            : "rounded-full bg-[var(--clay)] px-3 py-1.5 text-sm text-white hover:bg-[var(--clay-dark)]"
        }
      >
        {label}
      </button>
    </form>
  );
}
