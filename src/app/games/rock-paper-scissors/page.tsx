"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function RockPaperScissors() {
  const [round, setRound] = useState<{
    player: Choice;
    cpu: Choice;
    outcome: "win" | "lose" | "draw";
  } | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  function play(player: Choice) {
    const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const outcome = decide(player, cpu);
    setRound({ player, cpu, outcome });
    setScore((s) => ({ ...s, [outcome]: s[outcome] + 1 }));
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
        Wins: {score.win} · Losses: {score.lose} · Draws: {score.draw} · Total:{" "}
        {score.win + score.lose + score.draw}
      </p>
    </div>
  );
}
