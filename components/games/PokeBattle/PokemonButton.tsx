/* eslint-disable @next/next/no-img-element */
import { PokeBattlePokemonDetails } from "@/app/type";
import { Button } from "@/components/ui/button";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import StatusBadges from "./StatusBadge";
import Image from "next/image";

type PokemonButtonProps = {
  pokemon: PokeBattlePokemonDetails;
  handleAction: (pokemon: PokeBattlePokemonDetails) => void;
};

export default function PokemonButton({
  pokemon,
  handleAction,
}: PokemonButtonProps) {
  const { isActionPending, types } = usePokeBattle();
  const hpPercentage = Math.max(
    0,
    Math.min(100, (pokemon.currentHp / pokemon.stats.hp) * 100),
  );
  const pokemonTypes = pokemon.types.map((type) => {
    return types.find((t) => t.name.fr.toLowerCase() === type);
  });

  return (
    <Button
      key={pokemon.id}
      variant={"ghost"}
      onClick={() => handleAction(pokemon)}
      disabled={isActionPending}
      className={`flex flex-row items-center w-full h-auto py-2 px-2 border rounded text-xs uppercase group hover:bg-gray-100`}
    >
      <img
        src={pokemon.sprites.front || (pokemon.spritesFallback.front as string)}
        alt={pokemon.name}
        className="size-8 sm:size-16 object-contain"
      />

      <div className="flex flex-col items-start flex-1 ml-2 gap-0.5 overflow-hidden">
        <span className="flex flex-wrap items-center justify-between w-full font-bold text-slate-800 truncate text-xs sm:text-base">
          {pokemon.name}
          <div className="flex">
            {pokemonTypes.map((type) => (
              <Image
                src={type?.sprites ?? ""}
                alt={type?.name.fr ?? ""}
                height={28}
                width={28}
                sizes="(max-width: 640px) 32px, 48px"
                className="rounded-md object-cover p-0.5 size-5 sm:size-8"
                unoptimized
                key={type?.id}
              />
            ))}
          </div>
        </span>

        <div className="w-full bg-slate-300 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-400">
          <div
            className={`h-full ${hpPercentage <= 20 ? "bg-red-500" : hpPercentage <= 50 ? "bg-orange-400" : "bg-green-500"}`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>

        <span className="text-xs sm:text-sm font-bold text-slate-500">
          {pokemon.currentHp}/{pokemon.stats.hp}
        </span>
        <StatusBadges pokemon={pokemon} />
      </div>
    </Button>
  );
}
