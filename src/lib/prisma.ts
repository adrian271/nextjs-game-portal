// Prisma client singleton.
//
// Next.js dev mode hot-reloads modules on every change, which would otherwise
// create a brand-new PrismaClient (and a new DB connection pool) each time until
// the database runs out of connections. We cache the instance on `globalThis` so
// hot reloads reuse the same client. In production a single instance is created
// per server process, which is what we want.
//
// Import is from our custom generator output (`@/generated/prisma`), not
// "@prisma/client", because schema.prisma uses the new `prisma-client` generator
// with `output = "../src/generated/prisma"`.

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
