import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// Validate the body
const bodySchema = z.discriminatedUnion("game", [
  z.object({
    game: z.literal("rps"),
    outcome: z.enum(["win", "loss", "draw"]),
  }),
  z.object({ game: z.literal("ttt"), outcome: z.enum(["X", "O"]) }),
]);

type Statfield = "rpsWins" | "rpsLosses" | "rpsDraws" | "tttXWins" | "tttOWins";
const COUNTER: Record<string, Statfield> = {
  "rps:win": "rpsWins",
  "rps:loss": "rpsLosses",
  "rps:draw": "rpsDraws",
  "ttt:X": "tttXWins",
  "ttt:O": "tttOWins",
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid Input", issues: parsed.error.flatten() },
      { status: 400 },
    );

  const { game, outcome } = parsed.data;
  const field = COUNTER[`${game}:${outcome}`];
  if (!field)
    return NextResponse.json({ error: "Unknown Result" }, { status: 400 });

  const createData = {
    userId,
    [field]: 1,
  } as Prisma.GameStatsUncheckedCreateInput;
  const updateData = {
    [field]: { increment: 1 },
  } as Prisma.GameStatsUncheckedUpdateInput;

  await prisma.$transaction([
    prisma.gameResult.create({ data: { userId, game, outcome } }),
    prisma.gameStats.upsert({
      where: { userId },
      create: createData,
      update: updateData,
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
