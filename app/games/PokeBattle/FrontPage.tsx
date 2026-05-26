"use client";
import Board from "@/components/games/PokeBattle/Board";
import Ending from "@/components/games/PokeBattle/Ending";
import Waiting from "@/components/games/PokeBattle/Waiting";
import { usePokeBattle } from "@/context/PokeBattleProvider";

export default function FrontPage() {
  const { gameStatus, isFetching } = usePokeBattle();
  if (gameStatus === "waiting")
    return (
      <div className="size-full">
        <h1 className="text-center text-5xl md:text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_4px_0_rgba(220,38,38,1)] mt-8">
          {isFetching ? "PRÉPARATION..." : "POKÉ BATTLE"}
        </h1>
        <Waiting />
      </div>
    );
  if (gameStatus === "ending") return <Ending />;
  return (
    <div className="size-full">
      <Board />
    </div>
  );
}
