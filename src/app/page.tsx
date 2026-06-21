import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">🎮 Game Portal</h1>
        <p className="text-lg text-zinc-500">
          Sign in to play tic-tac-toe and rock-paper-scissors.
        </p>
      </div>

      {session?.user ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-zinc-600">
            Signed in as <strong>{session.user.email}</strong>
          </p>
          <Link
            href="/games"
            className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opac
ity hover:opacity-90"
          >
            Go to games →
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity
  hover:opacity-90"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-black/15 px-6 py-3 font-medium transition-colors
  hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      )}
    </main>
  );
}
