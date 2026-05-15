"use client";

import { useMemo } from "react";
import { MemoryDifficulty } from "@/app/type";
import { formatTime } from "@/lib/utils";
import { IMemoryLeaderboard } from "@/models/leaderboard";
import { Trophy } from "lucide-react";

type LeaderboardDisplayProps = {
  fullLeaderboard: IMemoryLeaderboard[];
};

export default function LeaderboardDisplay({
  fullLeaderboard,
}: LeaderboardDisplayProps) {
  const sortedByDifficulty = useMemo(() => {
    const difficulties: MemoryDifficulty[] = ["easy", "intermediate", "hard"];
    const results: Record<MemoryDifficulty, IMemoryLeaderboard[]> = {
      easy: [],
      intermediate: [],
      hard: [],
    };

    difficulties.forEach((diff) => {
      results[diff] = fullLeaderboard
        .filter((entry) => entry.difficulty === diff)
        .sort((a, b) => a.score - b.score || a.time - b.time)
        .slice(0, 5);
    });

    return results;
  }, [fullLeaderboard]);

  const difficultyNames = {
    easy: "Facile",
    intermediate: "Moyen",
    hard: "Difficile",
  };

  return (
    <div className="w-full max-w-7xl mt-2 lg:mt-8 mb-6 lg:mb-10 flex flex-col items-center gap-6 lg:gap-10 p-2 lg:p-0">
      {/* Container Principal Responsive */}
      <div className="w-full bg-[#f0f0f0] rounded-[24px] lg:rounded-[40px] border-[4px] lg:border-[6px] border-[#ffcb05] p-1.5 lg:p-2 shadow-[0_6px_0_0_rgba(0,0,0,0.2)] lg:shadow-[0_10px_0_0_rgba(0,0,0,0.2)]">
        {/* Switche de flex-col (mobile) à grid (bureau) */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 bg-white rounded-[20px] lg:rounded-[32px] overflow-hidden">
          {(["easy", "intermediate", "hard"] as MemoryDifficulty[]).map(
            (diff, index) => (
              <div
                key={diff}
                className={`w-full flex flex-col p-4 lg:p-8 border-slate-200 
                ${index < 2 ? "border-b-2 lg:border-b-0 lg:border-r-4" : ""}
              `}
              >
                {/* Titre de la difficulté Responsive */}
                <div className="flex items-center gap-2.5 lg:gap-3 mb-4 lg:mb-6">
                  <Trophy className="text-[#5cb85c] size-6 lg:size-7" />
                  <h3 className="text-xl lg:text-2xl font-black text-eau uppercase tracking-tighter">
                    Top 5 {difficultyNames[diff]}
                  </h3>
                </div>

                {/* Liste de scores Responsive */}
                <div className="space-y-2.5 lg:space-y-4">
                  {sortedByDifficulty[diff].map((entry, entryIndex) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between  bg-[#f0f0f0] rounded-lg lg:rounded-xl p-2 lg:p-4 border-b-2 border-slate-300 shadow-inner"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0 lg:gap-3">
                        <span className="text-lg lg:text-xl font-black text-dragon w-5 lg:w-6 text-center">
                          {entryIndex + 1}.
                        </span>
                        <p className="text-base lg:text-lg font-bold text-ténèbres truncate">
                          {entry.name}
                        </p>
                      </div>

                      {/* Maintien de l'alignement responsive pour les scores */}
                      <div className="flex flex-col items-end gap-0.5 text-right">
                        <p className="text-lg lg:text-xl font-black text-feu">
                          {entry.score}{" "}
                          <span className="text-sm lg:text-lg text-normal font-bold ">
                            Cps
                          </span>
                        </p>
                        <p className="text-lg lg:text-xl font-bold text-slate-600">
                          {formatTime(entry.time).replace("et", "")}
                        </p>
                      </div>
                    </div>
                  ))}

                  {sortedByDifficulty[diff].length === 0 && (
                    <p className="text-center text-slate-500 italic py-2 lg:py-4 text-sm lg:text-base">
                      Aucun score.
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
