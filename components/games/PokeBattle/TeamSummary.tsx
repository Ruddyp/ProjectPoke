/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { PokeBattleBuffOption } from "@/app/type";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { QUALITY_CONFIG } from "@/lib/utils";
import {
  BarChart3,
  Award,
  Shield,
  Sword,
  Heart,
  Eye,
  Sparkles,
  Target,
} from "lucide-react";

export const STAT_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  hp: {
    label: "PV",
    icon: <Heart className="size-3 sm:size-4 text-red-500" />,
  },
  attack: {
    label: "Atk",
    icon: <Sword className="size-3 sm:size-4 text-amber-500" />,
  },
  defense: {
    label: "Def",
    icon: <Shield className="size-3 sm:size-4 text-blue-500" />,
  },
  "special-attack": {
    label: "S.Atk",
    icon: <Sparkles className="size-3 sm:size-4 text-purple-500" />,
  },
  "special-defense": {
    label: "S.Def",
    icon: <Shield className="size-3 sm:size-4 text-indigo-500" />,
  },
  evasion: {
    label: "Esq",
    icon: <Eye className="size-3 sm:size-4 text-emerald-500" />,
  },
  accuracy: {
    label: "Préc",
    icon: <Target className="size-3 sm:size-4 text-sky-500" />,
  },
};

const CONFIG = QUALITY_CONFIG;

export function PokemonCard({ pokemon }: { pokemon: any }) {
  return (
    <div className="flex flex-col p-3 sm:p-4 rounded-md border border-slate-800 bg-slate-950/60 gap-2">
      {/* En-tête Pokémon */}
      <div className="flex items-center gap-3 mb-1 pb-2 border-b border-slate-800/60">
        <img
          src={pokemon.sprites.front ?? undefined}
          alt={pokemon.name}
          className="size-8 sm:size-12 object-contain"
        />
        <span className="text-xs sm:text-sm font-black uppercase text-slate-200 tracking-wider">
          {pokemon.name}
        </span>
      </div>

      {/* Grille des Stats numériques */}
      <div className="grid grid-cols-3 gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 text-[10px] sm:text-xs">
        {Object.entries(pokemon.stats).map(([statName, value]) => {
          if (statName === "speed") return null;

          const config = STAT_CONFIG[statName];
          if (!config) return null;

          return (
            <div
              key={statName}
              className="flex items-center justify-between bg-slate-900/80 px-2 sm:px-3 py-1 sm:py-2 rounded border border-slate-800"
            >
              <span className="text-slate-400 uppercase flex items-center gap-1 font-bold">
                {config.icon}
                {config.label}
              </span>
              <span className="font-black text-slate-100 sm:text-sm">
                {value as React.ReactNode}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BuffCard({ buff }: { buff: PokeBattleBuffOption }) {
  const BuffIcon = buff.icon || Award;
  const quality = CONFIG[buff.quality as keyof typeof CONFIG] || CONFIG.common;

  return (
    <div
      className={`flex items-start gap-3 p-3 sm:p-4 rounded border transition-all duration-200 ${quality.button}`}
    >
      {/* Box d'icône colorée */}
      <div
        className={`p-1.5 sm:p-2 border rounded mt-0.5 shadow-sm ${quality.icon}`}
      >
        <BuffIcon className={`size-4 sm:size-5`} />
      </div>

      {/* Contenu textuel */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Titre du Buff */}
          <span className="font-extrabold uppercase text-slate-100 tracking-wide text-xs sm:text-sm">
            {buff.title}
          </span>

          {/* Badge de Qualité (Commun, Rare, Épique, Légendaire) */}
          <span
            className={`text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded border tracking-widest font-bold ${quality.badge}`}
          >
            {quality.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed font-medium">
          {buff.description}
        </p>
      </div>
    </div>
  );
}

function EmptyBuffs() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-8 sm:py-12 text-center border-2 border-dashed border-slate-800 rounded">
      <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-bold">
        Aucun passif permanent obtenu
      </span>
      <span className="text-[10px] sm:text-xs text-slate-600 mt-1 max-w-[200px] sm:max-w-[280px]">
        Choisissez un buff après chaque victoire d'étage.
      </span>
    </div>
  );
}

export default function TeamSummary() {
  const { userPokemons, towerBuff } = usePokeBattle();

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* SECTION 1 : STATS DE L'ÉQUIPE */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="size-4 sm:size-5 text-blue-500" />
            Statistiques Réelles
          </h2>

          <div className="flex flex-col gap-4 bg-slate-900 border-2 border-slate-700 rounded-md p-4 sm:p-6">
            {userPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>

        {/* SECTION 2 : RECAP DES BUFFS REÇUS */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Award className="size-4 sm:size-5 text-emerald-500" />
            Bénédictions de la Tour
          </h2>

          <div className="flex flex-col gap-2 sm:gap-3 bg-slate-900 border-2 border-slate-700 rounded-md p-4 sm:p-6 min-h-[150px] sm:min-h-[200px] justify-start overflow-y-auto max-h-[360px] sm:max-h-[480px]">
            {towerBuff && towerBuff.length > 0 ? (
              towerBuff.map((buff, idx) => (
                <BuffCard key={`${buff.id}-${idx}`} buff={buff} />
              ))
            ) : (
              <EmptyBuffs />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
