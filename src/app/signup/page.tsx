"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(ev: React.SubmitEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(ev.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const name = (form.get("name") as string) || undefined;

    //1. Create account
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => {});
      setError(data.error ?? "Registration failed.");
      setPending(false);
      return;
    }

    // 2. Log in with same credentials
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (signInResult?.error) {
      //Account created but login failed
      router.push("/login");
      return;
    }

    router.push("/games");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Create your account</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          type="text"
          placeholder="Name (optional)"
          className="rounded-lg border border-black/15 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-black/15 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          className="rounded-lg border border-black/15 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity
  hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <p className="text-sm text-zinc-500">
        Already have an account?
        <Link href="/login" className="font-medium underline">
          Login
        </Link>
      </p>
    </main>
  );
}
