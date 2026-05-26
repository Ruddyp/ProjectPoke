"use client";

import { useMemo } from "react";
import { PokeBattleDifficulty } from "@/app/type";
import { POKEBATTLE_DIFFICULTIES } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import { IPokeBatlle } from "@/models/pokebattle_leaderboard";

export default function LeaderboardDisplay() {
  const { leaderboard } = usePokeBattle();
  const sortedByDifficulty = useMemo(() => {
    let results = {} as Record<PokeBattleDifficulty, IPokeBatlle[]>;
    POKEBATTLE_DIFFICULTIES.forEach((diff) => {
      results = { ...results, [diff]: [] };
    });

    POKEBATTLE_DIFFICULTIES.forEach((diff) => {
      results[diff] = leaderboard
        .filter((entry) => entry.difficulty === diff)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    });
    return results;
  }, [leaderboard]);

  return (
    <div className="w-full flex flex-col flex-wrap items-center">
      {/* Container Principal Sombre */}
      <div className="w-full bg-slate-900 rounded-3xl border-2 border-[#E0A850]/50 p-1 shadow-2xl">
        <div className="flex flex-row flex-wrap bg-slate-950 rounded-[22px]">
          {POKEBATTLE_DIFFICULTIES.map((diff, index) => (
            <div key={diff} className={`w-72 flex flex-col p-6 lg:p-8`}>
              {/* Titre */}
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-[#E0A850] size-6" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">
                  {diff}
                </h3>
              </div>

              {/* Liste de scores */}
              <div className="space-y-3">
                {sortedByDifficulty[diff].map((entry, entryIndex) => (
                  <div
                    key={entry._id}
                    className="flex gap-2 items-center justify-between bg-slate-900 rounded-xl p-3 border border-slate-700 hover:border-[#E0A850]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-black text-[#E0A850] w-6 text-center">
                        {entryIndex + 1}.
                      </span>
                      <p className="text-base font-bold text-slate-200 truncate uppercase">
                        {entry.name}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-white">
                        {entry.score}{" "}
                      </p>
                    </div>
                  </div>
                ))}

                {sortedByDifficulty[diff].length === 0 && (
                  <p className="text-left text-slate-600 italic py-4 text-sm font-bold uppercase tracking-widest">
                    Aucun score.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
