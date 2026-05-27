/* eslint-disable @next/next/no-img-element */
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { calculatePokemonTeamPower } from "@/lib/utils";

export default function BattlePresentation() {
  const { enemyPokemons, userPokemons } = usePokeBattle();
  const userTeamPower = calculatePokemonTeamPower(userPokemons);
  const enemyTeamPower = calculatePokemonTeamPower(enemyPokemons, true);

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden font-mono">
      <div className="absolute w-[150%] h-2 bg-red-600 rotate-[-15deg] z-10 shadow-[0_0_25px_rgba(220,38,38,0.9)]" />

      {/* Équipe ennemie */}
      <div className="absolute top-[15vh] left-1/2 -translate-x-1/2 xl:right-[calc(50%+100px)] xl:top-[20vh] xl:-translate-x-0 w-full xl:w-auto flex flex-col items-center xl:items-end gap-2 animate-in slide-in-from-top duration-1000">
        <h2 className="text-red-500 font-black tracking-widest text-sm uppercase drop-shadow-md">
          EQUIPE ADVERSE
        </h2>
        <div className="flex gap-2 p-4 bg-red-900 rounded-full">
          {enemyPokemons.map((poke) => (
            <div
              key={poke.id}
              className="size-12 xs:size-16 sm:size-24 bg-red-800/90 border-2 border-red-600 rounded-full flex items-center justify-center shadow-lg transform"
            >
              <img
                src={poke.sprites.front || ""}
                alt={poke.name}
                className="size-4/5 sm:size-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src = poke.spritesFallback.front as string;
                }}
              />
            </div>
          ))}
        </div>
        <span className="text-red-400 text-xs font-bold tracking-widest bg-red-950/80 px-3 py-1 rounded-full border border-red-800">
          PUISSANCE: {enemyTeamPower.toLocaleString()}
        </span>
      </div>

      <div className="z-20 text-7xl sm:text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] animate-pulse">
        VS
      </div>

      {/* Équipe utilisateur */}
      <div className="absolute bottom-[15vh] left-1/2 -translate-x-1/2 xl:bottom-[20vh] xl:-translate-x-0 w-full xl:w-auto flex flex-col items-center xl:items-start gap-2 animate-in slide-in-from-bottom duration-1000">
        <h2 className="text-blue-500 font-black tracking-widest text-sm uppercase drop-shadow-md">
          MON EQUIPE
        </h2>
        <div className="flex gap-2 p-4 bg-blue-900 rounded-full">
          {userPokemons.map((poke) => (
            <div
              key={poke.id}
              className="size-12 xs:size-16 sm:size-24 bg-blue-800/90 border-2 border-blue-600 rounded-full flex items-center justify-center shadow-lg transform"
            >
              <img
                src={poke.sprites.front || ""}
                alt={poke.name}
                className="size-4/5 sm:size-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src = poke.spritesFallback.front as string;
                }}
              />
            </div>
          ))}
        </div>
        <span className="text-blue-400 text-xs font-bold tracking-widest bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
          PUISSANCE: {userTeamPower.toLocaleString()}
        </span>
      </div>

      <div className="absolute bottom-6 w-full text-center">
        <span className="text-white text-base sm:text-xl font-bold tracking-[0.3em] animate-pulse">
          DÉBUT DU COMBAT!
        </span>
      </div>
    </div>
  );
}
