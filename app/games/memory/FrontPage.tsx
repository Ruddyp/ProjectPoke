"use client";

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
import { useMemory } from "@/context/MemoryProvider";
import { useState } from "react";

export default function FrontPage() {
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>("easy");
  const { gameStatus } = useMemory();
  const isNotOnGoing = gameStatus === "waiting" || gameStatus === "ending";
  return (
    <div className="flex flex-col items-center h-screen gap-2 md:gap-4">
      <h1 className="text-3xl md:text-5xl font-mono font-bold text-center">
        Memory game
      </h1>
      {isNotOnGoing && (
        <div className="flex flex-col md:flex-row items-center gap-2">
          <p>Choix de la difficulté:</p>
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as MemoryDifficulty)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem key={"easy"} value={"easy"}>
                  Facile
                </SelectItem>
                <SelectItem key={"intermediate"} value={"intermediate"}>
                  Intermédiaire
                </SelectItem>
                <SelectItem key={"hard"} value={"hard"}>
                  Difficile
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <Board difficulty={difficulty} />
    </div>
  );
}
