import {
  PokeBattleMoveCategory,
  PokeBattlePokemonMove,
  PokemonColorType,
  Types,
} from "@/app/type";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { colors } from "@/lib/utils";

type MovesMenuProps = {
  setCurrentMenu: Dispatch<SetStateAction<CurrentMenuType>>;
  moves: PokeBattlePokemonMove[];
};

type CurrentMenuType = "main" | "moves" | "pokemon" | "object" | "retreat";

export default function MovesMenu({ setCurrentMenu, moves }: MovesMenuProps) {
  const { handleUserAttack, isActionPending, types } = usePokeBattle();

  const getMoveCategorySrc = (moveCategory: PokeBattleMoveCategory) => {
    const formattedCategory =
      moveCategory.charAt(0).toUpperCase() +
      moveCategory.slice(1).toLowerCase();
    return `https://play.pokemonshowdown.com/sprites/categories/${formattedCategory}.png`;
  };

  return (
    <div className="grid grid-cols-2 gap-1 size-full">
      {moves.map((move, index) => {
        const colorType = move.type as PokemonColorType;
        const colorTypeLight = `${colorType}_light` as PokemonColorType;
        const moveType = types.find(
          (t) => t.name.fr.toLowerCase() === move.type,
        );
        return (
          <Button
            size={"sm"}
            variant={"ghost"}
            key={index}
            disabled={isActionPending}
            onClick={() => {
              handleUserAttack(move);
              setCurrentMenu("main");
            }}
            className={`flex items-center justify-between pl-2 px-1 sm:px-3 hover:bg-gray-100 hover:text-black rounded border text-xs uppercase group`}
            style={{
              background: `radial-gradient(circle 140px at 50% 100px,${colors[colorType]},${colors[colorTypeLight]})`,
            }}
          >
            <div>
              <span className="hidden group-hover:inline text-[#C83028]">
                ▶
              </span>{" "}
              <span className="text-xs">{move.name}</span>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={moveType?.sprites ?? ""}
                alt={moveType?.name.fr ?? ""}
                height={28}
                width={28}
                sizes="(max-width: 640px) 32px, 48px"
                className="rounded-md object-cover p-1 size-6 sm:size-8"
                unoptimized
                key={moveType?.id}
              />
              <Image
                src={getMoveCategorySrc(move.category)}
                alt={move.category}
                height={36}
                width={36}
                sizes="(max-width: 640px) 32px, 48px"
                className="rounded-md object-cover p-1 w-7 sm:w-10"
                unoptimized
              />
            </div>
          </Button>
        );
      })}
      <Button
        variant={"ghost"}
        onClick={() => setCurrentMenu("main")}
        className="h-6 col-span-2 text-center text-xs text-red-600 hover:bg-red-50 hover:text-red-600 rounded p-0"
      >
        Retour
      </Button>
    </div>
  );
}
