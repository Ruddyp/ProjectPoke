/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useState } from "react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { Button } from "@/components/ui/button";
import { PokeBattleObjectType, PokeBattlePokemonDetails } from "@/app/type";
import PokemonButton from "./PokemonButton";
import { sleep } from "@/lib/utils";

type ChangeMenuProps = {
  setCurrentMenu: Dispatch<SetStateAction<CurrentMenuType>>;
};

type CurrentMenuType = "main" | "moves" | "pokemon" | "object" | "retreat";

export default function ObjectMenu({ setCurrentMenu }: ChangeMenuProps) {
  const [objectChoice, setObjectChoice] = useState<null | PokeBattleObjectType>(
    null,
  );

  const {
    userObjects,
    isActionPending,
    handleUserObjectUse,
    userPokemons,
    setTextBox,
  } = usePokeBattle();

  const getActivePokemon = (pokemons: PokeBattlePokemonDetails[]) => {
    return (
      pokemons.find((poke) => poke.isActive && poke.stats.hp > 0) ??
      pokemons.find((p) => p.stats.hp > 0) ??
      pokemons[0]
    );
  };

  const handlePokemonChoice = async (pokemon: PokeBattlePokemonDetails) => {
    if (isActionPending) return;

    const activePokemon = getActivePokemon(userPokemons);
    const hasStatusEffect =
      pokemon.isParalyze ||
      pokemon.isAsleep ||
      pokemon.isFrozen ||
      pokemon.isBurnt ||
      pokemon.isPoisoned;

    // Cas où on veut soigner un pokémon qui a tous ses points de vie
    if (
      objectChoice === "heal" &&
      (pokemon.currentHp === pokemon.stats.hp || pokemon.currentHp <= 0)
    ) {
      setTextBox(`Les PV de ${pokemon.name} sont déjà au maximum !`);
      await sleep(1500);
      setTextBox(`Que doit faire ${activePokemon.name} ?`);
      setObjectChoice(null);
      return;
    }

    // Cas où on veut ressusciter un pokémon qui n'est pas K.O
    if (objectChoice === "reborn" && pokemon.currentHp > 0) {
      setTextBox(`${pokemon.name} n'est pas K.O. !`);
      await sleep(1500);
      setTextBox(`Que doit faire ${activePokemon.name} ?`);
      setObjectChoice(null);
      return;
    }

    // Cas où on veut soigner les status d'un pokémon qui n'a aucun status
    if (objectChoice === "status" && !hasStatusEffect) {
      setTextBox(`${pokemon.name} ne souffre d'aucune altération de statut.`);
      await sleep(1500);
      setTextBox(`Que doit faire ${activePokemon.name} ?`);
      setObjectChoice(null);
      return;
    }

    setCurrentMenu("main");
    handleUserObjectUse(objectChoice as PokeBattleObjectType, pokemon.id);
  };

  if (objectChoice !== null) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full">
        {userPokemons.map((poke) => {
          return (
            <PokemonButton
              key={poke.id}
              pokemon={poke}
              handleAction={handlePokemonChoice}
            />
          );
        })}
        <Button
          variant={"ghost"}
          onClick={() => setObjectChoice(null)}
          className="h-6 col-span-2 text-center text-xs text-red-600 hover:bg-red-50 hover:text-red-600 rounded p-0"
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {userObjects.map((obj) => {
        if (obj.quantity <= 0) return null;

        return (
          <Button
            key={obj.type}
            variant={"ghost"}
            onClick={() => setObjectChoice(obj.type)}
            disabled={isActionPending}
            className={`flex flex-row items-center w-full h-auto py-2 px-2 border rounded text-xs uppercase group hover:bg-gray-100`}
          >
            <img
              src={obj.src}
              alt={obj.name}
              className="size-8 sm:size-16 object-contain"
            />

            <div className="flex flex-row items-center flex-1 ml-2 gap-4 overflow-hidden">
              <span className="font-bold text-slate-800 truncate text-sm sm:text-base">
                {obj.name}
              </span>
              <span className="font-bold text-slate-800 lowercase truncate text-xs sm:text-sm">
                x{obj.quantity}
              </span>
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
