/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { Button } from "@/components/ui/button";
import { PokeBattlePokemonDetails } from "@/app/type";
import PokemonButton from "./PokemonButton";

type ChangeMenuProps = {
  setCurrentMenu: Dispatch<SetStateAction<CurrentMenuType>>;
};

type CurrentMenuType = "main" | "moves" | "pokemon" | "object" | "retreat";

export default function PokemonMenu({ setCurrentMenu }: ChangeMenuProps) {
  const { userPokemons, isActionPending, handlePokemonReplacement } =
    usePokeBattle();

  const handlePokemonChoice = (pokemon: PokeBattlePokemonDetails) => {
    setCurrentMenu("main");
    handlePokemonReplacement(pokemon.id, "user");
  };

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {userPokemons.map((poke) => {
        if (poke.isActive) return null;
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
        onClick={() => setCurrentMenu("main")}
        className="h-6 col-span-2 text-center text-xs text-red-600 hover:bg-red-50 hover:text-red-600 rounded p-0"
      >
        Retour
      </Button>
    </div>
  );
}
