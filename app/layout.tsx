import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

import { Header } from "@/components/header";
import { catalogAttribution } from "@/lib/courses";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Madison Fairways",
    template: "%s · Madison Fairways",
  },
  description:
    "Beli for golf — rank US courses you have played, not 5-star ratings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--line)] px-4 py-6 text-center text-xs text-[var(--muted)]">
          {catalogAttribution}. Pairwise ranking ships in Week 2 — no star
          ratings, ever.
        </footer>
      </body>
    </html>
  );
}
