import {
  PokeBattleMoveCategory,
  PokeBattlePokemonMove,
  PokemonColorType,
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
  const { handleUserAttack, isActionPending } = usePokeBattle();
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
            className={`flex items-center gap-1 justify-between pl-2 hover:bg-gray-100 hover:text-black rounded border text-xs uppercase group`}
            style={{
              background: `radial-gradient(circle 140px at 50% 100px,${colors[colorType]},${colors[colorTypeLight]})`,
            }}
          >
            <div>
              <span className="hidden group-hover:inline text-[#C83028]">
                ▶
              </span>{" "}
              {move.name}
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={getMoveCategorySrc(move.category)}
                alt={move.category}
                height={36}
                width={36}
                sizes="(max-width: 640px) 32px, 48px"
                className="rounded-md object-cover p-1"
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
