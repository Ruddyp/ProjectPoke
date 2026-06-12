/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { hasStatus, PRICES } from "@/lib/utils";
import { Heart } from "lucide-react";
import StatusBadges from "./StatusBadge"; // Ajuste le chemin selon ton architecture

type HealCenterProps = {
  marketAction: "heal_partial" | "heal_full" | "revive" | "antidote" | null;
  setMarketAction: (
    action: "heal_partial" | "heal_full" | "revive" | "antidote" | null,
  ) => void;
  onApplyService: (pokemonId: number) => void;
};

export default function TeamHealCenter({
  marketAction,
  setMarketAction,
  onApplyService,
}: HealCenterProps) {
  const { userPokemons, towerPoint, isFetching } = usePokeBattle();

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* En-tête de la section */}
      <h2 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Heart className="size-4 text-red-500" /> Centre Pokémon
      </h2>

      {/* Liste des Pokémon de l'équipe */}
      <div className="flex flex-col gap-3 bg-slate-900 border-2 border-slate-700 rounded-md p-4">
        {userPokemons.map((pokemon) => {
          const hpPct = (pokemon.currentHp / pokemon.stats.hp) * 100;
          const isDead = pokemon.currentHp <= 0;

          return (
            <div
              key={pokemon.id}
              className="flex items-center w-full justify-between gap-4 p-3 rounded-md border-2 bg-slate-800 border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Sprite du Pokémon */}
                <div className="flex-shrink-0 bg-slate-950/40 rounded-lg p-1 border border-slate-700/50">
                  <img
                    src={pokemon.sprites.front ?? undefined}
                    alt={pokemon.name}
                    className="size-12 object-contain"
                  />
                </div>

                {/* Infos, Barre de PV & Statuts */}
                <div className="flex-1 min-w-0 max-w-md">
                  <div className="flex flex-wrap items-center justify-between text-xs font-bold uppercase gap-x-2 gap-y-1 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`truncate tracking-wide ${isDead ? "text-red-500 line-through opacity-60" : "text-slate-100"}`}
                      >
                        {pokemon.name}
                      </span>
                      {/* Intégration des badges de statuts actifs (GEL, PAR, PSN...) */}
                      <StatusBadges pokemon={pokemon} />
                    </div>

                    <span className="text-slate-400 font-mono flex-shrink-0">
                      {pokemon.currentHp}/{pokemon.stats.hp} PV
                    </span>
                  </div>

                  {/* Barre de progression des PV */}
                  <div className="w-full h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hpPct > 50
                          ? "bg-green-500"
                          : hpPct > 20
                            ? "bg-amber-500"
                            : "bg-red-600 animate-pulse"
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, hpPct))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bouton d'action contextuel */}
              {marketAction && (
                <button
                  disabled={
                    (marketAction === "revive" && !isDead) ||
                    (marketAction !== "revive" && isDead) ||
                    (marketAction !== "revive" &&
                      pokemon.currentHp === pokemon.stats.hp) ||
                    (marketAction === "antidote" && !hasStatus(pokemon)) ||
                    isFetching
                  }
                  onClick={() => onApplyService(pokemon.id)}
                  className="px-4 py-2 bg-red-600 border border-red-400 rounded-md text-xs font-black uppercase tracking-wider hover:bg-red-500 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all flex-shrink-0 shadow-md"
                >
                  Utiliser
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Grille d'achat des soins */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["heal_partial", "heal_full", "revive", "antidote"] as const).map(
          (type) => {
            const isSelected = marketAction === type;
            const canAfford = towerPoint >= PRICES[type];

            return (
              <button
                key={type}
                disabled={!canAfford && !isSelected}
                onClick={() => setMarketAction(isSelected ? null : type)}
                className={`p-3 border-2 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 group ${
                  isSelected
                    ? "border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/80 disabled:opacity-20"
                }`}
              >
                <span
                  className={`text-xs font-black uppercase tracking-wide ${isSelected ? "text-red-400" : "text-slate-200"}`}
                >
                  {type === "heal_partial"
                    ? "Soin Partiel (+50%)"
                    : type === "heal_full"
                      ? "Soin Total (100%)"
                      : type === "revive"
                        ? "Ressusciter (50%)"
                        : "Soigner les états"}
                </span>
                <span
                  className={`text-[11px] font-bold ${isSelected ? "text-red-300/80" : "text-slate-400 font-mono"}`}
                >
                  {PRICES[type]} PTS
                </span>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}
