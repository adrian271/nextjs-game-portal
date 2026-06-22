"use client";

import { useState } from "react";
import Link from "next/link";
import { recordResult } from "@/lib/recordResult";
import { useRouter } from "next/navigation";

const CHOICES = ["rock", "paper", "scissors"] as const;
type Choice = (typeof CHOICES)[number];

const EMOJI: Record<Choice, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

// Returns the outcome from the player's perspective.
function decide(player: Choice, cpu: Choice): "win" | "lose" | "draw" {
  if (player === cpu) return "draw";
  const beats: Record<Choice, Choice> = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };
  return beats[player] === cpu ? "win" : "lose";
}

// Module-scope so the CPU's random pick isn't an "impure call during render"
// (React's react-hooks/purity rule). Called only from the click handler.
function randomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export function RpsGame({
  allTime,
}: {
  allTime: { wins: number; losses: number; draws: number };
}) {
  const router = useRouter();
  const [round, setRound] = useState<{
    player: Choice;
    cpu: Choice;
    outcome: "win" | "lose" | "draw";
  } | null>(null);

  async function play(player: Choice) {
    const cpu = randomChoice();
    const outcome = decide(player, cpu);
    setRound({ player, cpu, outcome });

    // Persist to the DB, then re-read the server-rendered all-time totals.
    await recordResult({
      game: "rps",
      outcome: outcome === "lose" ? "loss" : outcome,
    });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <Link href="/games" className="text-sm text-zinc-500 underline">
        ← Back to games
      </Link>
      <h1 className="text-2xl font-bold">Rock Paper Scissors</h1>

      <div className="flex justify-center gap-3">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            onClick={() => play(choice)}
            className="flex flex-col items-center gap-1 rounded-xl border border-black/15 px-6 py-4 text-3xl
  transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            {EMOJI[choice]}
            <span className="text-xs capitalize text-zinc-500">{choice}</span>
          </button>
        ))}
      </div>

      {round && (
        <div className="space-y-1">
          <p className="text-lg">
            You {EMOJI[round.player]} vs {EMOJI[round.cpu]} CPU
          </p>
          <p className="text-2xl font-bold">
            {round.outcome === "win"
              ? "You win! 🎉"
              : round.outcome === "lose"
                ? "You lose 😝"
                : "Draw 🤝"}
          </p>
        </div>
      )}

      <p className="text-sm text-zinc-500">
        All-time · Wins: {allTime.wins} · Losses: {allTime.losses} · Draws:{" "}
        {allTime.draws}
      </p>
    </div>
  );
}
