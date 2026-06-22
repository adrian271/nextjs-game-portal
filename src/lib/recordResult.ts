export async function recordResult(
  body:
    | { game: "rps"; outcome: "win" | "loss" | "draw" }
    | { game: "ttt"; outcome: "X" | "O" },
): Promise<void> {
  try {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {}
}
