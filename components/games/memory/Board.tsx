"use client";

import { useMemory } from "@/context/MemoryProvider";
import MemoryTuile from "./Tuile";
import { Button } from "@/components/ui/button";
import { MemoryDifficulty } from "@/app/type";

type BoardProps = {
  difficulty: MemoryDifficulty;
};

export default function Board({ difficulty }: BoardProps) {
  const { gameStatus, tuiles, nbClick, startGame } = useMemory();
  console.log({ nbClick });

  const gridConfig = {
    easy: "md:grid-cols-4",
    intermediate: "md:grid-cols-6",
    hard: "md:grid-cols-8",
  };

  const columnsClass = gridConfig[difficulty] || "grid-cols-4";

  if (gameStatus === "waiting") {
    return (
      <div className="flex flex-col size-full items-center justify-start gap-4 mt-24">
        <Button onClick={() => startGame(difficulty)}>
          Démarrer la partie
        </Button>
      </div>
    );
  }

  if (gameStatus === "ending") {
    return (
      <div className="flex flex-col size-full items-center justify-start gap-4">
        <h1 className="font-serif text-xl sm:text-2xl md:text-4xl">
          Bravo vous avez gagné la partie !
        </h1>
        <p className="text-base sm:text-lg md:text-2xl">
          Nombre de coups:{" "}
          <span className="font-semibold text-red-400">{nbClick}</span>
        </p>
        <Button onClick={() => startGame(difficulty)}>
          Démarrer une nouvelle partie
        </Button>
      </div>
    );
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
