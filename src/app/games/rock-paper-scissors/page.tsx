import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RpsGame } from "./RpsGame";

export default async function RpsPage() {
  const session = await auth();
  // The games layout already guards this, but we re-check so TS knows id exists.
  if (!session?.user?.id) redirect("/login");

  const stats = await prisma.gameStats.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <RpsGame
      allTime={{
        wins: stats?.rpsWins ?? 0,
        losses: stats?.rpsLosses ?? 0,
        draws: stats?.rpsDraws ?? 0,
      }}
    />
  );
}
