"use client";

import { useState } from "react";
import { MemoryDifficulty } from "@/app/type";
import Board from "@/components/games/memory/Board";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMemory } from "@/context/MemoryProvider";
import LeaderboardDisplay from "@/components/games/memory/Leaderboard";

export default function FrontPage() {
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>("easy");
  const { gameStatus, leaderboard, startGame } = useMemory();
  const isWaiting = gameStatus === "waiting";
  const isEnding = gameStatus === "ending";

  console.log("leaderboard", leaderboard);

  return (
    <div className="flex flex-col items-center min-h-screen gap-6 py-10 px-4 bg-gradient-to-b from-[#6b90c3] to-[#4a6d9b]">
      {/* Title with golden-yellow Ludic/Pokémon style */}
      <div className="mb-4 animate-in zoom-in-95 duration-500">
        <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter text-[#ffcb05] drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] [text-shadow:_0_0_20px_rgba(255,203,5,0.6)]">
          Memory game
        </h1>
      </div>

      {isWaiting && (
        <>
          {/* Difficulty selector integrated into the game style */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-white rounded-[20px] p-4 md:p-6 border-b-4 border-slate-300 shadow-lg">
            <p className="text-base md:text-xl font-bold text-slate-800">
              Choix de la difficulté:
            </p>
            <Select
              value={difficulty}
              onValueChange={(value) =>
                setDifficulty(value as MemoryDifficulty)
              }
            >
              <SelectTrigger className="w-[180px] bg-[#f0f0f0] rounded-xl border-b-2 border-slate-300 font-bold text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border-b-4 border-slate-300 shadow-xl">
                <SelectGroup>
                  <SelectItem
                    key="easy"
                    value="easy"
                    className="font-bold text-slate-800  hover:text-red-500"
                  >
                    Facile
                  </SelectItem>
                  <SelectItem
                    key="intermediate"
                    value="intermediate"
                    className="font-bold text-slate-800"
                  >
                    Intermédiaire
                  </SelectItem>
                  <SelectItem
                    key="hard"
                    value="hard"
                    className="font-bold text-slate-800"
                  >
                    Difficile
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* New "Play" button with Pokémon-style relief */}
          <Button
            onClick={() => startGame(difficulty)}
            className="mt-6 bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-base md:text-xl font-black px-8 py-6 md:px-12 md:py-8 rounded-full border-b-[6px] border-[#3d8b3d] shadow-[0_8px_20px_rgba(92,184,92,0.4)] transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0"
          >
            Lancer la partie
          </Button>
        </>
      )}

      {/* Boards only appears if not waiting */}
      {!isWaiting && <Board difficulty={difficulty} />}

      {/* Integrated leaderboard, always visible */}
      {isEnding ||
        (isWaiting && <LeaderboardDisplay fullLeaderboard={leaderboard} />)}
    </div>
  );
}
