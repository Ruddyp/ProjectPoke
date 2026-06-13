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

const CONFIG = QUALITY_CONFIG;

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
  const cleanDescription = buff.description.replace(/^\[.*?\]\s*/, "");

  // Sécurité anti-bug de casse (ex: "LÉGENDAIRE" -> "legendary")
  const rawQuality = String(buff.quality || "common")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const qualityKey = rawQuality === "legendaire" ? "legendary" : rawQuality;

  const quality = CONFIG[qualityKey as keyof typeof CONFIG] || CONFIG.common;

  return (
    <button
      onClick={() => onSelect(buff)}
      className={`border-[3px] rounded-2xl p-6 flex flex-col items-center text-center gap-5 transition-all duration-300 group relative overflow-hidden h-full min-h-[320px] hover:-translate-y-1 ${quality.button}`}
    >
      {/* Halo de lumière en tâche de fond (optionnel mais stylé) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full blur-3xl opacity-20 bg-current pointer-events-none" />

      {/* --- PARTIE BADGE --- */}
      <span
        className={`absolute top-0 left-1/2 -translate-x-1/2 text-[10px] uppercase px-3 py-1 rounded-b-xl border-x border-b tracking-widest font-black shadow-md z-10 ${quality.badge}`}
      >
        {quality.label}
      </span>

      {/* --- PARTIE ICÔNE --- */}
      <div
        className={`p-4 border-2 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10 mt-4 ${quality.icon}`}
      >
        <Icon className="size-8 stroke-[2.5]" />
      </div>

      {/* Contenu textuel */}
      <div className="flex flex-col gap-3 flex-1 justify-between w-full relative z-10 mt-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-black uppercase tracking-wider text-base sm:text-lg text-slate-100">
            {buff.title}
          </h3>
          <div className="w-12 h-[2px] bg-slate-700 mx-auto rounded group-hover:w-20 transition-all duration-300" />
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed px-2 flex-1 flex items-center justify-center">
          {cleanDescription}
        </p>
      </div>

      {/* Effet brillant de carte TCG au survol */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
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
