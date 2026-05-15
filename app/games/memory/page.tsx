import { Pokemon } from "@/app/type";
import { getGen1 } from "@/lib/fetch";
import { MemoryProvider } from "@/context/MemoryProvider";
import FrontPage from "./FrontPage";
import { getLeaderboard } from "@/lib/bdd";
import { IMemoryLeaderboard } from "@/models/leaderboard";

export default async function Page() {
  const pokemons: Pokemon[] = await getGen1();
  const memoryLeaderboard: IMemoryLeaderboard[] = await getLeaderboard();

  return (
    <MemoryProvider pokemons={pokemons} memoryLeaderboard={memoryLeaderboard}>
      <div className="size-full">
        <FrontPage />
      </div>
    </MemoryProvider>
  );
}
