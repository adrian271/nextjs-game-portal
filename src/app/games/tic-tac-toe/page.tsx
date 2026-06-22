import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TttGame } from "./TttGame";

export default async function TttPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const stats = await prisma.gameStats.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <TttGame
      allTime={{ xWins: stats?.tttXWins ?? 0, oWins: stats?.tttOWins ?? 0 }}
    />
  );
}
