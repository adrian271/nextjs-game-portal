"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
    >
      Sign out
    </button>
  );
}
