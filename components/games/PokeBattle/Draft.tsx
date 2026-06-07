/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { calculatePokemonPower, calculatePokemonTeamPower } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Draft() {
  const { types, draftChoices, userPokemons, nextRoundResolver, isFetching } =
    usePokeBattle();

  const isUserFinished = userPokemons.length === 6;

  const handlePickPokemon = (pokemon: any) => {
    if (nextRoundResolver.current) {
      nextRoundResolver.current(pokemon);
    }
  };

  return (
    <div className="relative max-w-5xl w-full bg-slate-900 border-4 border-[#E0A850] rounded-2xl p-6 shadow-2xl font-mono animate-in fade-in zoom-in-95 duration-200">
      {/* ========================================================= */}
      {/* EN-TÊTE DE LA DRAFT */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-slate-700 pb-4 mb-6 gap-2">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-widest text-center sm:text-left">
            {isUserFinished ? "Draft Terminée !" : "Phase de Draft"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider mt-1 text-center sm:text-left">
            {isUserFinished
              ? "Votre équipe est prête pour le combat"
              : "Composez votre équipe de 6 Pokémon"}
          </p>
        </div>

        {/* Compteur de progression */}
        <div className="bg-slate-800 border-2 border-slate-600 rounded-md px-4 py-2 flex items-center gap-3 shadow-inner">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
            Choix
          </span>
          <span className="text-[#E0A850] text-2xl font-black tracking-widest">
            {userPokemons.length + 1}
            <span className="text-white text-lg font-normal">/6</span>
          </span>
        </div>
        <div className="bg-slate-800 border-2 border-slate-600 rounded-md px-4 py-2 flex items-center gap-3 shadow-inner">
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
            Puissance de l'équipe:
          </span>
          <span className="text-[#E0A850] text-2xl font-black tracking-widest">
            <span className="text-white text-lg font-normal">
              {calculatePokemonTeamPower(userPokemons)}
            </span>
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CORPS DU COMPOSANT : CHARGEMENT, ATTENTE, OU GRILLE */}
      {/* ========================================================= */}
      {isUserFinished ? (
        /* VUE 1 : ÉCRAN D'ATTENTE DE L'ADVERSAIRE (6/6 validés) */
        <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <Loader2 className="size-12 text-[#E0A850] animate-spin" />
            <h3 className="text-white text-xl font-black uppercase tracking-widest animate-pulse">
              En attente de l'adversaire...
            </h3>
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Le combat commencera dès que les deux dresseurs auront fini.
            </p>
          </div>

          {/* Grille récapitulative de TON équipe */}
          <div className="w-full">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 text-center sm:text-left">
              Votre Équipe Finale :
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
              {userPokemons.map((pokemon, index) => (
                <div
                  key={`${pokemon.id}-${index}`}
                  className="bg-[#F8F8F0] border-2 border-slate-700 rounded-lg p-2 flex flex-col items-center shadow-md relative group overflow-hidden"
                >
                  <span className="absolute top-1 left-1 text-[10px] font-bold text-slate-400">
                    #{index + 1}
                  </span>
                  <div className="w-16 h-16 flex items-center justify-center mb-1">
                    <img
                      src={pokemon.sprites?.front ?? undefined}
                      alt={pokemon.name}
                      className="object-contain max-w-full max-h-full pixelated"
                      onError={(e) => {
                        e.currentTarget.src = pokemon.spritesFallback
                          .front as string;
                      }}
                    />
                  </div>
                  <span className="text-slate-800 text-[10px] font-black uppercase tracking-tight text-center truncate w-full">
                    {pokemon.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isFetching ? (
        /* VUE 2 : CHARGEMENT ENTRE DEUX MANCHES DE DRAFT */
        <div className="flex flex-col items-center justify-center py-20 min-h-[350px] animate-in fade-in duration-200">
          <Loader2 className="size-16 text-red-600 animate-spin mb-4" />
          <h3 className="text-white text-xl font-bold tracking-widest uppercase animate-pulse text-center">
            Récupération des choix...
          </h3>
          <p className="text-slate-400 text-xs uppercase tracking-wider mt-2 text-center">
            Génération de 3 nouveaux Pokémon aléatoires
          </p>
        </div>
      ) : (
        /* VUE 3 : GRILLE DES 3 CHOIX DISPONIBLES (Draft active) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in duration-200">
          {draftChoices.map((pokemon) => {
            const pokemonTypes = pokemon.types.map((type) => {
              return types.find((t) => t.name.fr.toLowerCase() === type);
            });

            const maxHp = pokemon.stats.hp;

            return (
              <div
                key={pokemon.id}
                className="bg-[#F8F8F0] border-4 border-slate-700 rounded-xl p-4 shadow-lg flex flex-col justify-between items-center transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group"
              >
                {/* Nom et Types */}
                <div className="w-full flex justify-between items-center font-bold text-slate-800 text-sm border-b border-slate-300 pb-2 mb-4">
                  <span className="truncate max-w-[120px]">
                    {pokemon.name.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-0.5 bg-slate-200/60 p-0.5 rounded-md">
                    {pokemonTypes.map((type) => (
                      <Image
                        src={type?.sprites ?? ""}
                        alt={type?.name.fr ?? ""}
                        height={24}
                        width={24}
                        className="rounded-sm object-cover size-6 sm:size-7"
                        unoptimized
                        key={type?.id}
                      />
                    ))}
                  </div>
                </div>

                {/* Image / GIF */}
                <div className="relative w-32 h-32 flex items-center justify-center bg-slate-200/40 rounded-lg border border-slate-300/60 shadow-inner mb-4 overflow-hidden">
                  <img
                    src={pokemon.sprites?.front ?? undefined}
                    alt={pokemon.name}
                    className="object-contain max-w-[110px] max-h-[110px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = pokemon.spritesFallback
                        .front as string;
                    }}
                  />
                </div>

                {/* Barre de PV */}
                <div className="w-full mb-6">
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-[10px] font-bold bg-[#E8A020] text-white px-1 py-0.5 rounded-sm shadow-sm tracking-wider">
                      PV
                    </span>
                    <div className="w-full bg-slate-300 h-3 rounded-full border border-slate-400 overflow-hidden shadow-inner">
                      <div className="bg-[#48D080] h-full w-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black text-slate-700 mt-1">
                    <span>Puissance: {calculatePokemonPower(pokemon)}</span>
                    <span>
                      {maxHp} / {maxHp} PV
                    </span>
                  </div>
                </div>

                {/* Bouton de sélection */}
                <button
                  onClick={() => handlePickPokemon(pokemon)}
                  className="w-full py-3 bg-slate-800 border-[3px] border-slate-600 rounded-md text-white font-black text-sm uppercase tracking-widest transition-all duration-150 hover:border-[#E0A850] hover:bg-slate-700 active:scale-95 shadow-md"
                >
                  Choisir
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
