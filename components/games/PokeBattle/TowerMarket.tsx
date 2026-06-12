import { useState } from "react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import BuffSelection from "./BuffSelection";
import TeamHealCenter from "./TeamHealCenter";
import TowerMarketHeader from "./TowerMarketHeader";
import TacticalShop from "./TacticalShop";
import { isEven, PRICES } from "@/lib/utils";
import { PokeBattleBuffOption } from "@/app/type";
import TeamSummary from "./TeamSummary";

export default function TowerMarket() {
  const {
    userPokemons,
    setUserPokemons,
    userObjects,
    setUserObjects,
    towerPoint,
    setTowerPoint,
    floor,
    setTowerBuff,
    loadTowerFloor,
    setGameStatus,
    setPokemonStatsBeforeMatch,
  } = usePokeBattle();

  const [hasChosenBuff, setHasChosenBuff] = useState(false);
  const [marketAction, setMarketAction] = useState<
    "heal_partial" | "heal_full" | "revive" | "antidote" | null
  >(null);

  const handleSelectBuff = (buff: PokeBattleBuffOption) => {
    setUserPokemons(buff.action([...userPokemons]));
    setTowerBuff((prev) => [...prev, buff]);
    setHasChosenBuff(true);
  };

  const handlePokemonService = (pokemonId: number) => {
    if (!marketAction) return;
    const cost = PRICES[marketAction];
    if (towerPoint < cost) return;

    const updated = userPokemons.map((p) => {
      if (p.id !== pokemonId) return p;
      if (marketAction === "heal_partial")
        return {
          ...p,
          currentHp: Math.min(
            p.stats.hp,
            p.currentHp + Math.round(p.stats.hp * 0.5),
          ),
        };
      if (marketAction === "heal_full") return { ...p, currentHp: p.stats.hp };
      if (marketAction === "antidote")
        return {
          ...p,
          isParalyze: false,
          isAsleep: false,
          isFrozen: false,
          isBurnt: false,
          isPoisoned: false,
          isSeeded: false,
        };
      if (marketAction === "revive")
        return { ...p, currentHp: Math.round(p.stats.hp * 0.5) };
      return p;
    });

    setUserPokemons(updated);
    setTowerPoint((prev: number) => prev - cost);
    setMarketAction(null);
  };

  const handleBuyObject = (
    type: "heal" | "reborn" | "status",
    cost: number,
  ) => {
    if (towerPoint < cost) return;
    const updatedObjects = userObjects.map((obj) =>
      obj.type === type ? { ...obj, quantity: obj.quantity + 1 } : obj,
    );
    setUserObjects(updatedObjects);
    setTowerPoint((prev: number) => prev - cost);
  };

  const handleNextFloor = async () => {
    setPokemonStatsBeforeMatch(userPokemons.map((p) => p.stats));
    await loadTowerFloor(floor);
    setGameStatus("presentation");
  };

  return (
    <div className="bg-background flex flex-col items-center justify-start gap-6 p-4 sm:p-6 font-mono min-h-screen w-full text-white overflow-y-auto">
      <TowerMarketHeader />

      {!hasChosenBuff && isEven(floor) ? (
        <BuffSelection onSelect={handleSelectBuff} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-4xl animate-in zoom-in-95 duration-200">
            <TeamHealCenter
              onApplyService={handlePokemonService}
              marketAction={marketAction}
              setMarketAction={setMarketAction}
            />
            <TacticalShop
              towerPoint={towerPoint}
              onBuyObject={handleBuyObject}
              onNextFloor={handleNextFloor}
            />
          </div>

          <TeamSummary />
        </>
      )}
    </div>
  );
}
