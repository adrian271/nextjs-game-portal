import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Single Auth.js (NextAuth v5) config.
//
// We previously planned an "edge-safe split" (auth.config.ts + auth.ts) because
// the old Next.js *middleware* ran on the Edge runtime, which can't load Prisma
// or bcrypt. In Next.js 16, middleware was renamed to "Proxy" and now runs on the
// Node.js runtime — so we can import this full config (Prisma + bcrypt and all)
// directly into proxy.ts. No split required.

// Validate the shape of the submitted credentials before touching the DB.
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnGames = request.nextUrl.pathname.startsWith("/games");
      if (isOnGames) return isLoggedIn;
      return true;
    },

    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },

    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
