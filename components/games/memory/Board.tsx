"use client";

import { useMemory } from "@/context/MemoryProvider";
import MemoryTuile from "./Tuile";
import { Button } from "@/components/ui/button";
import { MemoryDifficulty } from "@/app/type";
import { formatTime } from "@/lib/utils";
import Waiting from "./Waiting";
import Ending from "./Ending";

type BoardProps = {
  difficulty: MemoryDifficulty;
};

export default function Board({ difficulty }: BoardProps) {
  const { gameStatus, tuiles, score, startGame, leaderboard, time } =
    useMemory();

  const gridConfig = {
    easy: "md:grid-cols-4",
    intermediate: "md:grid-cols-6",
    hard: "md:grid-cols-8",
  };

  const columnsClass = gridConfig[difficulty] || "grid-cols-4";

  console.log("leaderboard", leaderboard);

  if (gameStatus === "waiting") {
    return <Waiting difficulty={difficulty} />;
  }

  if (gameStatus === "ending") {
    return <Ending difficulty={difficulty} />;
  }

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className={`grid grid-cols-4 ${columnsClass} gap-2 h-[75vh]`}>
        {tuiles.map((tuile) => (
          <MemoryTuile key={tuile.id} tuile={tuile} />
        ))}
      </div>
    </div>
  );
}
