import { usePokeBattle } from "@/context/PokeBattleProvider";
import BattleTerrain from "./BattleTerrain";
import ActionMenu from "./ActionMenu";
import BattlePresentation from "./BattlePresentation";
import { useEffect, useRef } from "react";

export default function Board() {
  const {
    enemyPokemons,
    userPokemons,
    gameStatus,
    startBattle,
    trainer,
    socket,
    opponentSocketId,
  } = usePokeBattle();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Musique de combat
    timer = setTimeout(() => {
      const audioSrc = trainer ? trainer.battleAudioSrc : "/sounds/battle.mp3";
      const audio = new Audio(audioSrc);
      audio.volume = 0.05;
      const LOOP_START = trainer ? 0 : 21.0;

      const handleTimeUpdate = () => {
        if (audio.currentTime >= audio.duration - 0.1) {
          audio.currentTime = LOOP_START;
          audio.play().catch(console.error);
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.play().catch((e) => console.warn("Auto-play bloqué :", e));

      audioRef.current = audio;
    }, 800);

    return () => {
      if (timer) clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [trainer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameStatus === "presentation") {
      timer = setTimeout(() => {
        startBattle(socket?.id, opponentSocketId ?? undefined);
      }, 4500);
    }

    // Cleanup : si le composant est démonté avant la fin, on annule le timer
    return () => clearTimeout(timer);
  }, [gameStatus, startBattle, socket?.id, opponentSocketId]);

  const activeUserPokemon =
    userPokemons.find((poke) => poke.isActive) ?? userPokemons[0];
  const activeEnemyPokemon =
    enemyPokemons.find((poke) => poke.isActive) ?? enemyPokemons[0];

  if (!activeUserPokemon || !activeEnemyPokemon) {
    return <div className="p-4 text-center">Chargement des équipes...</div>;
  }

  return (
    <div className="w-full max-w-5xl h-full mx-auto aspect-[4/3] bg-[#E0D8A8] flex flex-col font-mono select-none border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Présentation des équipes */}
      {gameStatus === "presentation" && <BattlePresentation />}

      {gameStatus !== "presentation" && (
        <>
          {/* Zone du Terrain de jeu */}
          <BattleTerrain
            userPokemon={activeUserPokemon}
            enemyPokemon={activeEnemyPokemon}
          />

          {/* Menu d'action */}
          <ActionMenu userPokemon={activeUserPokemon} />
        </>
      )}
    </div>
  );
}
