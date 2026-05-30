/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { getTrainersMap, TRAINERS } from "@/lib/utils"; // Assurez-vous d'importer votre fonction ici

export default function LeaderboardDisplay() {
  const { leaderboard } = usePokeBattle();
  const [selectedGen, setSelectedGen] = useState<number | string | null>(null);

  const trainersByGen = useMemo(() => {
    const map = getTrainersMap(TRAINERS);
    map["Random"] = [
      {
        name: "Random",
        img: "/shuffle.png",
        gen: "Random",
        pokemons: [],
        battleAudioSrc: "",
        victoryAudioSrc: "",
        power: 0,
        intelligence: 0.5,
      },
    ];

    return map;
  }, []);

  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border-2 border-[#E0A850]/50 p-2 shadow-2xl">
        <div className="bg-slate-950 rounded-[22px] p-4">
          <h2 className="text-2xl font-black text-white text-center mb-6 uppercase tracking-widest">
            Classement par Génération
          </h2>

          <div className="flex flex-col gap-4">
            {Object.entries(trainersByGen).map(([gen, trainerList]) => (
              <div key={gen} className="flex flex-col">
                {/* Carte Génération */}
                <button
                  onClick={() =>
                    selectedGen === null
                      ? setSelectedGen(gen)
                      : setSelectedGen(null)
                  }
                  className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    selectedGen === gen // Comparaison directe sans Number()
                      ? "bg-[#E0A850] border-[#E0A850] text-slate-950"
                      : "bg-slate-900 border-slate-700 text-white hover:border-[#E0A850]"
                  }`}
                >
                  <span className="font-black uppercase tracking-widest">
                    {gen === "Random" ? "Mode Random" : `Génération ${gen}`}
                  </span>
                  {selectedGen === gen ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>

                {/* Liste des dresseurs déployée */}
                {selectedGen === gen && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 animate-in slide-in-from-top-2">
                    {trainerList.map((trainer) => {
                      // On filtre les scores. Si trainer.name est "Dresseur Aléatoire",
                      // vous devrez peut-être ajuster la logique de filtre ici.
                      const topScores = leaderboard
                        .filter((entry) => entry.difficulty === trainer.name)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5);

                      return (
                        <div
                          key={trainer.name}
                          className="flex flex-col bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={trainer.img}
                              alt={trainer.name}
                              className="size-12 sm:size-16 rounded-full bg-slate-800"
                            />
                            <span className="font-bold text-slate-200">
                              {trainer.name}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {topScores.length > 0 ? (
                              topScores.map((score, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-slate-500">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-slate-200 font-bold truncate px-2">
                                    {score.name}
                                  </span>
                                  <span className="font-black text-[#E0A850]">
                                    {score.score.toLocaleString()}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-600 italic">
                                Aucun score
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
