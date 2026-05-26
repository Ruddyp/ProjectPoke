import { PokeBattleProvider } from "@/context/PokeBattleProvider";
import FrontPage from "./FrontPage";
import { getTypes } from "@/lib/fetch";
import { IPokeBatlle } from "@/models/pokebattle_leaderboard";
import { getPokeBattleLeaderboard } from "@/lib/bdd";

export default async function Page() {
  const types = await getTypes();
  const pokeBattleLeaderboard: IPokeBatlle[] = await getPokeBattleLeaderboard();
  return (
    <PokeBattleProvider
      types={types}
      pokeBattleLeaderboard={pokeBattleLeaderboard}
    >
      <div className="size-full overflow-y-auto">
        <FrontPage />
      </div>
    </PokeBattleProvider>
  );
}
