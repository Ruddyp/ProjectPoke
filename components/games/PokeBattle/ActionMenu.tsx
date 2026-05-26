/* eslint-disable react/no-unescaped-entities */
import { PokeBattlePokemonDetails, PokeBattlePokemonMove } from "@/app/type";
import { useEffect, useState } from "react";
import MainMenu from "./MainMenu";
import MovesMenu from "./MovesMenu";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { getRandomMoves } from "@/lib/utils";
import PokemonMenu from "./PokemonMenu";
import ObjectMenu from "./ObjectMenu";
import RetreatMenu from "./RetreatMenu";

type ActionMenuProps = {
  userPokemon: PokeBattlePokemonDetails;
};

export type CurrentMenuType =
  | "main"
  | "moves"
  | "pokemon"
  | "object"
  | "retreat";

export default function ActionMenu({ userPokemon }: ActionMenuProps) {
  const { textBox, gameStatus } = usePokeBattle();
  const [currentMenu, setCurrentMenu] = useState<CurrentMenuType>("main");
  const [moves, setMoves] = useState<PokeBattlePokemonMove[]>([]);

  useEffect(() => {
    if (gameStatus === "user_turn") {
      setMoves(getRandomMoves(userPokemon.moves));
    }
  }, [gameStatus, userPokemon.moves]);

  return (
    <div className=" bg-[#383838] border-t-4 border-[#888888] flex p-1.5 gap-1.5">
      {/* Texte d'ambiance à gauche */}
      <div className="flex flex-col  w-full">
        <div className="h-24 bg-[#285068] border-[3px] border-[#E0A850] rounded px-4  items-center text-white text-base md:text-lg tracking-wide shadow-inner min-h-20 md:min-h-20">
          <p>{textBox}</p>
        </div>
        <div className="">
          {gameStatus === "user_turn" ? (
            <div className="min-h-36 size-full bg-white border-[3px] border-[#A0A0A0] rounded p-2 text-slate-800 font-bold text-sm">
              {currentMenu === "main" && (
                <MainMenu setCurrentMenu={setCurrentMenu} />
              )}
              {currentMenu === "moves" && (
                <MovesMenu setCurrentMenu={setCurrentMenu} moves={moves} />
              )}
              {currentMenu === "pokemon" && (
                <PokemonMenu setCurrentMenu={setCurrentMenu} />
              )}
              {currentMenu === "object" && (
                <ObjectMenu setCurrentMenu={setCurrentMenu} />
              )}
              {currentMenu === "retreat" && (
                <RetreatMenu setCurrentMenu={setCurrentMenu} />
              )}
            </div>
          ) : (
            <div className="min-h-36 flex items-center justify-center bg-white border-[3px] border-[#A0A0A0] rounded p-2 text-slate-800 font-bold text-sm">
              <span>Tour de l'adversaire ...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
