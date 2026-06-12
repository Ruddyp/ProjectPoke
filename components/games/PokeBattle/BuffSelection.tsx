/* eslint-disable @next/next/no-img-element */
import { useMemo } from "react";
import { PokeBattleBuffOption } from "@/app/type";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { QUALITY_CONFIG, TOWER_BUFFS } from "@/lib/utils";
import {
  Award,
  Heart,
  Sword,
  Shield,
  Sparkles,
  Eye,
  Target,
} from "lucide-react";

// Mini configuration d'icônes compacte pour le récapitulatif de l'équipe
const MINI_STAT_CONFIG: Record<string, { icon: React.ReactNode }> = {
  hp: { icon: <Heart className="size-4 text-red-500" /> },
  attack: { icon: <Sword className="size-4 text-amber-500" /> },
  defense: { icon: <Shield className="size-4 text-blue-500" /> },
  "special-attack": { icon: <Sparkles className="size-4 text-purple-500" /> },
  "special-defense": { icon: <Shield className="size-4 text-indigo-500" /> },
  evasion: { icon: <Eye className="size-4 text-emerald-500" /> },
  accuracy: { icon: <Target className="size-4 text-sky-500" /> },
};

type BuffSelectionProps = {
  onSelect: (buff: PokeBattleBuffOption) => void;
};

// ==========================================
// SOUS-COMPOSANT : APERÇU DE L'ÉQUIPE (COMPACT)
// ==========================================
function TeamStatsPreview() {
  const { userPokemons } = usePokeBattle();

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 mb-2">
      <h3 className="text-center text-sm font-black uppercase text-slate-400 tracking-widest mb-3">
        État et Statistiques de votre Équipe
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {userPokemons.map((pokemon) => {
          const isDead = pokemon.currentHp <= 0;
          const hpPct = (pokemon.currentHp / pokemon.stats.hp) * 100;

          return (
            <div
              key={pokemon.id}
              className="flex items-center gap-2 bg-slate-950/50 border border-slate-800/80 p-2 rounded-lg"
            >
              {/* Miniature */}
              <img
                src={pokemon.sprites.front ?? undefined}
                alt={pokemon.name}
                className={`size-10 object-contain flex-shrink-0 ${isDead ? "grayscale opacity-40" : ""}`}
              />

              {/* Infos & Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-sm font-bold uppercase mb-1">
                  <span
                    className={`truncate ${isDead ? "text-red-500 line-through" : "text-slate-200"}`}
                  >
                    {pokemon.name}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    {pokemon.currentHp}/{pokemon.stats.hp}
                  </span>
                </div>

                {/* Petite jauge de PV */}
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-300 ${hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-amber-500" : "bg-red-600"}`}
                    style={{ width: `${Math.max(0, Math.min(100, hpPct))}%` }}
                  />
                </div>

                {/* Grille des valeurs de stats */}
                <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-slate-300">
                  {Object.entries(pokemon.stats).map(([statName, value]) => {
                    if (statName === "speed" || !MINI_STAT_CONFIG[statName])
                      return null;
                    return (
                      <span
                        key={statName}
                        className="flex items-center gap-0.5 bg-slate-900/80 p-1.5 rounded border border-slate-800/50"
                      >
                        {MINI_STAT_CONFIG[statName].icon}
                        {value as React.ReactNode}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// SOUS-COMPOSANT : BOUTON D'OPTION DE BUFF
// ==========================================
function BuffOptionButton({
  buff,
  onSelect,
}: {
  buff: PokeBattleBuffOption;
  onSelect: (buff: PokeBattleBuffOption) => void;
}) {
  const Icon = buff.icon || Award;
  const quality =
    QUALITY_CONFIG[buff.quality as keyof typeof QUALITY_CONFIG] ||
    QUALITY_CONFIG.common;

  const cleanDescription = buff.description.replace(/^\[.*?\]\s*/, "");

  return (
    <button
      onClick={() => onSelect(buff)}
      className={`border-2 rounded-xl p-5 flex flex-col items-center text-center gap-4 transition-all duration-200 group relative overflow-hidden ${quality.border}`}
    >
      {/* Badge de Qualité/Rareté */}
      <span
        className={`absolute top-3 right-3 text-[9px] uppercase px-1.5 py-0.5 rounded border tracking-widest font-bold shadow-sm ${quality.badge}`}
      >
        {quality.label}
      </span>

      {/* Conteneur d'icône */}
      <div
        className={`p-3.5 border rounded-full group-hover:scale-110 transition-transform shadow-inner mt-2 ${quality.iconBg}`}
      >
        <Icon className="size-7" />
      </div>

      {/* Contenu textuel */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-extrabold uppercase tracking-wider text-sm sm:text-base text-slate-100 group-hover:text-amber-400 transition-colors">
          {buff.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {cleanDescription}
        </p>
      </div>
    </button>
  );
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function BuffSelection({ onSelect }: BuffSelectionProps) {
  // Tirage aléatoire stabilisé via useMemo (évite le shuffle à chaque render)
  const randomBuffs = useMemo(() => {
    return [...TOWER_BUFFS].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl my-auto animate-in fade-in duration-300 px-4">
      <h2 className="text-center font-bold text-sm sm:text-base text-amber-400 uppercase tracking-widest mb-2">
        — Étape 1 : Choisissez votre bonus de victoire —
      </h2>

      {/* RENDER : Aperçu des Pokémon et de leurs stats */}
      <TeamStatsPreview />

      {/* RENDER : Grille de sélection des 3 options de buffs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {randomBuffs.map((buff) => (
          <BuffOptionButton key={buff.id} buff={buff} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
