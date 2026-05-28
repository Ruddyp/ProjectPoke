/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { usePokeBattle } from "@/context/PokeBattleProvider";
import {
  addScoreToPokeBattleLeaderboard,
  replaceScoreToPokeBattleLeaderboard,
} from "@/lib/bdd";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Ending() {
  const {
    goToWaitingScreen,
    userPokemons,
    leaderboard,
    trainer,
    enemyScore,
    userScore,
    addToLeaderboard,
    updateLeaderboard,
  } = usePokeBattle();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const isUserWin = userPokemons.some((poke) => poke.currentHp > 0);
  const score = enemyScore - userScore;
  console.log("score", score);
  const difficulty = trainer?.name ?? "Random";

  useEffect(() => {
    let timer = setTimeout(() => {
      const audioSrc = trainer
        ? trainer.victoryAudioSrc
        : "/sounds/victory.mp3";
      const victoryAudio = new Audio(audioSrc);
      victoryAudio.volume = 0.05;
      victoryAudio.play().catch((e) => console.warn("Auto-play bloqué :", e));
      audioRef.current = victoryAudio;
    }, 800);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [trainer]);

  const difficultyLeaderboard = useMemo(
    () =>
      leaderboard
        .filter((elem) => elem.difficulty === difficulty)
        .sort((a, b) => b.score - a.score),
    [leaderboard, difficulty],
  );

  const lastScore = difficultyLeaderboard[difficultyLeaderboard.length - 1];

  const canBeSaveToLeaderboard = useMemo(() => {
    if (!isUserWin) return false;
    if (difficultyLeaderboard.length < 5) return true;
    return score > lastScore.score;
  }, [difficultyLeaderboard, lastScore, isUserWin, score]);

  const handleScoreUpdate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const scoreToPush = { name, difficulty, score };
      if (difficultyLeaderboard.length >= 5 && lastScore) {
        const updatedDoc = await replaceScoreToPokeBattleLeaderboard(
          lastScore._id!,
          scoreToPush,
        );
        updateLeaderboard(lastScore._id!, updatedDoc);
      } else {
        const newDoc = await addScoreToPokeBattleLeaderboard(scoreToPush);
        addToLeaderboard(newDoc);
      }
      setHasSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#2b2b2b] animate-in fade-in duration-1000">
      <div className="absolute w-[150%] h-2 bg-red-600 rotate-[-15deg] z-0 shadow-[0_0_20px_rgba(220,38,38,0.8)]" />

      <div className="z-10 flex flex-col items-center gap-2 sm:gap-4 p-6 sm:p-10 bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl">
        <h1 className="text-5xl sm:text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_4px_0_rgba(220,38,38,1)]">
          {isUserWin ? "VICTOIRE !" : "DEFAITE !"}
        </h1>

        <div className="h-px w-32 bg-red-600 my-2" />

        <p className="text-base sm:text-xl text-slate-300 font-bold tracking-[0.2em] uppercase">
          {isUserWin ? "Le combat est remporté" : "Le combat est perdu"}
        </p>

        {isUserWin && (
          <div className="bg-slate-800/50 border-2 border-red-600 rounded-xl p-4 text-slate-200 text-center font-semibold tracking-widest uppercase text-sm">
            Votre score:{" "}
            <span className="font-extrabold text-base text-slate-50">
              {score}
            </span>
          </div>
        )}
        {/* Section Record */}
        <div className="mt-8 w-full max-w-2xl">
          {canBeSaveToLeaderboard && (
            <div className="bg-slate-800 border-2 border-[#E0A850] rounded-xl p-4 flex items-center justify-center gap-3 shadow-lg">
              <Sparkles className="text-[#E0A850] size-5" />
              <p className="text-[#E0A850] font-bold text-base lg:text-lg tracking-widest uppercase">
                Nouveau record : Top 5 atteint !
              </p>
              <Sparkles className="text-[#E0A850] size-5" />
            </div>
          )}
          {!canBeSaveToLeaderboard && (
            <div className="text-slate-400 text-center font-bold tracking-widest uppercase text-sm">
              Dommage ! Il en faut plus pour détrôner les meilleurs...
            </div>
          )}
        </div>

        {/* Formulaire d'enregistrement */}
        {!hasSaved && canBeSaveToLeaderboard && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-2xl animate-in fade-in duration-1000">
            <input
              type="text"
              placeholder="Ton blaze..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
              className="flex-1 px-6 py-4 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-lg font-bold focus:outline-none focus:border-[#E0A850] transition-all placeholder:text-slate-600"
            />
            <Button
              onClick={handleScoreUpdate}
              disabled={
                isSubmitting ||
                name.trim().length < 2 ||
                name.trim().length > 15
              }
              className="bg-[#E0A850] hover:bg-[#c6943f] text-slate-900 font-black px-8 py-7 rounded-xl shadow-lg active:translate-y-1 transition-all"
            >
              {isSubmitting ? "ENVOI..." : "ENREGISTRER"}
            </Button>
          </div>
        )}

        {hasSaved && (
          <div className="mt-6 p-4 bg-slate-800 border-2 border-[#E0A850] rounded-xl font-black text-[#E0A850] tracking-widest uppercase shadow-lg">
            Score enregistré !
          </div>
        )}

        <button
          onClick={goToWaitingScreen}
          className="mt-6 sm:mt-8 px-8 sm:px-10 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded border-2 border-slate-600 hover:border-slate-400 transition-all hover:scale-105 active:scale-95"
        >
          REVENIR AU MENU
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.2),_transparent)] animate-pulse" />
    </div>
  );
}
