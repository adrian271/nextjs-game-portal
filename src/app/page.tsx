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
        <Link
          href="/auth/signin"
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
        >
          Sign in →{" "}
        </Link>
      )}
    </main>
  );
}
