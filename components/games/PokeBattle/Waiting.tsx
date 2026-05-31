/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { getTrainersMap, TRAINERS } from "@/lib/utils";
import { Loader2, Trophy, X } from "lucide-react";
import LeaderboardDisplay from "./Leaderboard";
import TrainerGen from "./TrainerGen";
import Room from "./Room";
import Draft from "./Draft";

export default function Waiting() {
  const {
    startGame,
    isFetching,
    battleMode,
    isDrafting,
    userPokemons,
    enemyPokemons,
  } = usePokeBattle();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const trainers = getTrainersMap(TRAINERS);

  const isPvPMode = battleMode === "pvp";

  return (
    <div className="bg-background flex flex-col items-center justify-center gap-6 p-4 sm:p-6 font-mono overflow-y-auto min-h-screen">
      {/* ========================================================= */}
      {/* SECTION SOLO / PVE */}
      {/* ========================================================= */}
      {!isPvPMode && (
        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-300">
          {/* Zone des dresseurs */}
          <div
            className={`flex flex-row flex-wrap gap-4 justify-center transition-opacity duration-300 ${isFetching ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          >
            {Object.entries(trainers).map(([gen, trainerList], index) => (
              <TrainerGen
                key={`${index}-${gen}`}
                gen={gen}
                trainers={trainerList}
              />
            ))}
          </div>

          {/* Bouton Leaderboard */}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-4 w-max bg-slate-800 border-[3px] border-slate-600 rounded-md flex flex-row gap-2 sm:flex-col items-center justify-center text-white font-black uppercase tracking-widest hover:border-[#E0A850] hover:bg-slate-700 transition-all shadow-lg active:scale-95 group"
          >
            <Trophy className="size-7 sm:mb-2 text-[#E0A850] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm">Afficher Classement</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION MULTIJOUEUR */}
      {/* ========================================================= */}
      <div
        className={`w-full max-w-md transition-all duration-300 ${isPvPMode ? "mt-12" : ""}`}
      >
        {!isPvPMode && (
          <h2 className="text-center font-bold text-lg text-slate-500 uppercase tracking-widest mb-2">
            Mode Multijoueur
          </h2>
        )}
        <Room />
      </div>

      {/* ========================================================= */}
      {/* BOUTON DE LANCEMENT SOLO */}
      {/* ========================================================= */}
      {!isPvPMode && (
        <div className="z-10 w-full max-w-md">
          <button
            disabled={isFetching}
            onClick={() => startGame()}
            className={`w-full h-16 rounded-md border-2 border-slate-600 group text-white font-black text-xl uppercase tracking-widest transition-all ${isFetching && "opacity-50 cursor-not-allowed"}`}
            style={{
              background: `radial-gradient(circle 200px at 50% 50%, #dc2626, #991b1b)`,
            }}
          >
            <span className="hidden group-hover:inline">▶</span>{" "}
            {isFetching ? "CHARGEMENT..." : "COMBAT ALÉATOIRE"}
          </button>
        </div>
      )}

      {/* Modals Leaderboard & Fetching */}
      {showLeaderboard && (
        <div className="fixed w-full h-screen inset-0 z-[100] p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative h-max w-full bg-slate-900 border-2 border-[#E0A850] rounded-2xl p-4 shadow-2xl ">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
            >
              <X className="size-6 sm:size-8" />
            </button>
            <h2 className="text-white text-3xl font-black text-center mb-6 uppercase tracking-widest">
              Classement
            </h2>
            <LeaderboardDisplay />
          </div>
        </div>
      )}

      {isFetching && battleMode === "pve" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="size-16 text-red-600 animate-spin mb-4" />
          <p className="text-white text-xl font-bold tracking-widest uppercase animate-pulse">
            Récupération des équipes...
          </p>
        </div>
      )}

      {isDrafting && (
        <div className="fixed flex flex-wrap justify-center w-full h-screen inset-0 z-[100] p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <Draft />
        </div>
      )}
    </div>
  );
}
