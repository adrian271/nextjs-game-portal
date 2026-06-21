import Link from "next/link";

const games = [
  { title: "Tic-Tac-Toe", emoji: "❌⭕", href: "/games/tic-tac-toe" },
  {
    title: "Rock Paper Scissors",
    emoji: "🪨📄✂️",
    href: "/games/rock-paper-scissors",
  },
];

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Pick a game</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => (
          <li key={game.href}>
            <Link
              href={game.href}
              className="flex flex-col gap-2 rounded-xl border border-black/10 p-6 transition-colors
  hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              <span className="text-3xl">{game.emoji}</span>
              <span className="font-medium">{game.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
