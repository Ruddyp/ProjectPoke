import { PokeBattlePokemonDetails } from "@/app/type";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import Image from "next/image";
import StatusBadges from "./StatusBadge";

type HUDProps = {
  pokemon: PokeBattlePokemonDetails;
  isEnemy?: boolean;
};

export default function PokemonHUD({ pokemon, isEnemy = false }: HUDProps) {
  const { types } = usePokeBattle();

  const pokemonTypes = pokemon.types.map((type) => {
    return types.find((t) => t.name.fr.toLowerCase() === type);
  });

  // Calcul du pourcentage de PV restants
  const maxHp = pokemon.stats.hp;
  const currentHp = pokemon.currentHp;
  const hpPercentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  // Choix de la couleur selon le pourcentage de PV restants
  let hpColor = "bg-[#48D080]";
  if (hpPercentage <= 20) {
    hpColor = "bg-[#F85838]";
  } else if (hpPercentage <= 50) {
    hpColor = "bg-[#F8A010]";
  }

  return (
    <div
      className={`absolute min-w-40 sm:w-64 bg-[#F8F8F0] border-2 border-slate-700 p-2 shadow
      ${
        isEnemy
          ? "top-2 left-2 sm:top-6 sm:left-6 rounded-br-xl rounded-tl-sm"
          : "bottom-2 right-2 sm:bottom-6 sm:right-6 rounded-bl-xl rounded-tr-sm"
      }`}
      key={`${pokemon.id}-${isEnemy.toString()}`}
    >
      {/* Nom et Niveau */}
      <div className="flex justify-between items-center font-bold text-slate-800 text-sm">
        <div className="flex items-center gap-1">
          <span>{pokemon.name.toUpperCase()}</span>
          <span className="text-blue-500 text-base">♂</span>
        </div>
        <div className="flex items-center gap-1">
          {pokemonTypes.map((type) => (
            <Image
              src={type?.sprites ?? ""}
              alt={type?.name.fr ?? ""}
              height={28}
              width={28}
              sizes="(max-width: 640px) 32px, 48px"
              className="rounded-lg object-cover p-1 size-6 sm:size-8"
              unoptimized
              key={type?.id}
            />
          ))}
        </div>
      </div>
      {/* Barre de PV */}
      <div className="mt-1 flex items-center gap-1">
        <span className="text-[10px] font-bold bg-[#E8A020] text-white px-0.5 rounded-sm">
          PV
        </span>
        <div className="w-full bg-slate-300 h-2.5 rounded-full border border-slate-400 overflow-hidden">
          <div
            className={`${hpColor} h-full transition-all duration-1000 ease-linear`}
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-right text-xs font-bold text-slate-700 mt-0.5">
        <span>
          {currentHp} / {maxHp}
        </span>
      </div>
      <StatusBadges pokemon={pokemon} />
    </div>
  );
}
