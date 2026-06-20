// Proxy = Next.js 16's renamed Middleware (now on the Node.js runtime).
// Re-exporting Auth.js's `auth` as `proxy` runs our `authorized` callback
// (src/auth.ts) on every matched request: not logged in -> redirect to /login.
// This is an optimistic UX gate; the real guard is the auth() check in the
// games layout (added with the pages).
export { auth as proxy } from "@/auth";

export const config = {
  // `:path*` = zero-or-more segments, so this matches /games AND /games/anything.
  matcher: ["/games/:path*"],
};
