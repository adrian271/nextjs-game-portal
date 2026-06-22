"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { recordResult } from "@/lib/recordResult";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares: (string | null)[]): string | null {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

export function TttGame({
  allTime,
}: {
  allTime: { xWins: number; oWins: number };
}) {
  const router = useRouter();
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [xIsNext, setXisNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "It's a draw!"
      : `Next player: ${xIsNext ? "X" : "O"}`;

  async function handleClick(i: number) {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXisNext(!xIsNext);

    // If this move won, record X's or O's win and re-read the totals.
    const w = calculateWinner(next);
    if (w === "X" || w === "O") {
      await recordResult({ game: "ttt", outcome: w });
      router.refresh();
    }
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXisNext(true);
  }

  return (
    <div className="mx-auto max-w-xs space-y-6 text-center">
      <Link href="/games" className="text-sm text-zinc-500 underline">
        ← Back to games
      </Link>
      <h1 className="text-2xl font-bold">Tic-Tac-Toe</h1>
      <p className="text-lg">{status}</p>

      <div className="grid grid-cols-3 gap-2">
        {squares.map((value, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="flex aspect-square items-center justify-center rounded-lg border border-black/15
  text-3xl font-bold transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            {value}
          </button>
        ))}
      </div>

      <button
        onClick={reset}
        className="rounded-full bg-foreground px-6 py-2 font-medium text-background transition-opacity
  hover:opacity-90"
      >
        Reset
      </button>

      <p className="text-sm text-zinc-500">
        All-time wins · X: {allTime.xWins} · O: {allTime.oWins}
      </p>
    </div>
  );
}
